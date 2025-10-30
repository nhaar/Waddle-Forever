import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import { useTranslation } from '../hooks/useTranslation';
import { useRoomRecords } from '../context/RoomRecordsContext';
import { useCalendarStatus } from '../context/CalendarStatusContext';
import { useSettings } from '../context/SettingsContext';
import {
  parseDateRanges,
  isoToDate,
  toISODate,
  formatDateForDisplay,
  formatStoredDateRanges,
  ensureISODate,
} from '../utils/dateRanges';
import useAccessControl from '../hooks/useAccessControl';
import {
  getRecordCategoryKey,
  isPartyRecordCategory,
  RECORD_CATEGORY,
} from '../utils/recordCategory';

const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const YEAR_OPTIONS = [2005, 2006, 2007, 2008, 2009, 2010];

import { RECORD_STATUS_OPTIONS, resolveRecordStatusOption } from '../utils/recordStatus';
import CachedImage from '../components/CachedImage';

function getComparableIdRoom(record) {
  const { idRoom } = record ?? {};
  if (typeof idRoom === 'string') {
    return idRoom.trim();
  }

  if (idRoom === null || idRoom === undefined) {
    return '';
  }

  return String(idRoom).trim();
}

function getRecordRoomKey(record) {
  const idRoom = getComparableIdRoom(record).toLowerCase();
  if (idRoom) {
    return `id:${idRoom}`;
  }

  const roomName = typeof record?.room === 'string' ? record.room.trim().toLowerCase() : '';
  if (roomName) {
    return `room:${roomName}`;
  }

  const nameFile = typeof record?.nameFile === 'string' ? record.nameFile.trim().toLowerCase() : '';
  if (nameFile) {
    return `name:${nameFile}`;
  }

  const idList = typeof record?.idList === 'string' ? record.idList.trim().toLowerCase() : '';
  if (idList) {
    return `list:${idList}`;
  }

  return 'unknown';
}

function buildMonthMatrix(anchorDate) {
  const year = anchorDate.getFullYear();
  const month = anchorDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  const weeks = [];
  let currentWeek = [];

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    currentWeek.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    currentWeek.push(new Date(year, month, day));
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

function collectRecordsByDay(records) {
  const map = {};

  records.forEach((record) => {
    const ranges = parseDateRanges(record?.dates);
    if (!Array.isArray(ranges) || ranges.length === 0) {
      return;
    }

    ranges.forEach((range) => {
      const startDate = isoToDate(range?.start);
      const endDate = isoToDate(range?.end);
      if (!startDate || !endDate) {
        return;
      }

      const cursor = new Date(startDate);
      while (cursor <= endDate) {
        const iso = toISODate(cursor);
        if (iso) {
          if (!map[iso]) {
            map[iso] = [];
          }
          const entries = map[iso];
          const roomKey = getRecordRoomKey(record);
          const existingIndex = entries.findIndex((entry) => getRecordRoomKey(entry) === roomKey);
          if (existingIndex >= 0) {
            const existingRecord = entries[existingIndex];
            const existingIsParty = isPartyRecordCategory(existingRecord?.recordCategory);
            const nextIsParty = isPartyRecordCategory(record?.recordCategory);

            if (existingIsParty && !nextIsParty) {
              // Keep the existing party record when a base entry overlaps.
            } else if (!existingIsParty && nextIsParty) {
              entries[existingIndex] = record;
            } else {
              entries[existingIndex] = record;
            }
          } else {
            entries.push(record);
          }
        }
        cursor.setDate(cursor.getDate() + 1);
      }
    });
  });

  Object.keys(map).forEach((iso) => {
    map[iso].sort((a, b) => {
      const idRoomA = getComparableIdRoom(a);
      const idRoomB = getComparableIdRoom(b);
      const hasIdRoomA = idRoomA.length > 0;
      const hasIdRoomB = idRoomB.length > 0;

      if (hasIdRoomA && hasIdRoomB) {
        const comparison = idRoomA.localeCompare(idRoomB, undefined, {
          sensitivity: 'base',
          numeric: true,
        });
        if (comparison !== 0) {
          return comparison;
        }
      } else if (hasIdRoomA) {
        return -1;
      } else if (hasIdRoomB) {
        return 1;
      }

      const aIsParty = isPartyRecordCategory(a?.recordCategory);
      const bIsParty = isPartyRecordCategory(b?.recordCategory);
      if (aIsParty !== bIsParty) {
        return aIsParty ? -1 : 1;
      }

      const nameA = (a?.nameFile || '').toLowerCase();
      const nameB = (b?.nameFile || '').toLowerCase();
      if (nameA && nameB) {
        const comparison = nameA.localeCompare(nameB, undefined, {
          sensitivity: 'base',
          numeric: true,
        });
        if (comparison !== 0) {
          return comparison;
        }
      }

      const idA = (a?.idList || '').toString().toLowerCase();
      const idB = (b?.idList || '').toString().toLowerCase();
      return idA.localeCompare(idB, undefined, { sensitivity: 'base', numeric: true });
    });
  });

  return map;
}

export default function CalendarScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { records } = useRoomRecords();
  const {
    statuses,
    setStatusForDate,
    clearStatusForDate,
    icons: iconAssignments,
    addIconForDate,
    removeIconForDate,
    clearIconsForDate,
    comments,
    setCommentForDate,
    clearCommentForDate,
  } = useCalendarStatus();
  const { calendarIcons, calendarHolidayIcons, calendarHolidays } = useSettings();
  const { isEditor } = useAccessControl();

  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDateIso, setSelectedDateIso] = useState(() => toISODate(today));
  const [isYearMenuVisible, setYearMenuVisible] = useState(false);
  const [isMonthMenuVisible, setMonthMenuVisible] = useState(false);
  const [isHolidayMenuVisible, setHolidayMenuVisible] = useState(false);
  const [holidaySearch, setHolidaySearch] = useState('');
  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const reference = new Date(2000, index, 1);
        return {
          index,
          shortLabel: reference.toLocaleDateString(undefined, { month: 'short' }),
          longLabel: reference.toLocaleDateString(undefined, { month: 'long' }),
        };
      }),
    []
  );

  const recordsByDay = useMemo(() => collectRecordsByDay(records), [records]);

  const monthMatrix = useMemo(() => buildMonthMatrix(currentMonth), [currentMonth]);
  const weeksWithMetadata = useMemo(() => {
    let lastMonthIndex = -1;
    return monthMatrix.map((week) => {
      const firstValidDate = week.find((day) => day instanceof Date);
      const monthIndex = firstValidDate instanceof Date ? firstValidDate.getMonth() : lastMonthIndex;
      const yearValue = firstValidDate instanceof Date ? firstValidDate.getFullYear() : currentMonth.getFullYear();
      const shouldShowLabel = firstValidDate instanceof Date && monthIndex !== lastMonthIndex;

      if (firstValidDate instanceof Date) {
        lastMonthIndex = monthIndex;
      }

      const monthShort = firstValidDate instanceof Date
        ? firstValidDate.toLocaleDateString(undefined, { month: 'short' })
        : '';
      const yearShort = firstValidDate instanceof Date
        ? `'${String(yearValue).slice(-2)}`
        : '';

      return {
        week,
        showMonthLabel: shouldShowLabel,
        monthShort,
        yearShort,
      };
    });
  }, [monthMatrix, currentMonth]);
  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();
  const currentMonthOption = monthOptions[currentMonthIndex] ?? null;
  const currentMonthLongLabel = currentMonthOption?.longLabel ?? '';
  const holidayOptions = useMemo(() => {
    return calendarHolidays
      .map((entry) => ({
        key: entry.key,
        name: typeof entry.name === 'string' ? entry.name.trim() : String(entry.name ?? '').trim(),
        date: ensureISODate(entry.date),
        iconKey: typeof entry.iconKey === 'string' ? entry.iconKey.trim() : undefined,
      }))
      .filter((entry) => entry.name && entry.date)
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }, [calendarHolidays]);
  const filteredHolidayOptions = useMemo(() => {
    const normalizedQuery = holidaySearch.trim().toLowerCase();
    if (!normalizedQuery) {
      return holidayOptions;
    }
    return holidayOptions.filter((entry) => entry.name.toLowerCase().includes(normalizedQuery));
  }, [holidayOptions, holidaySearch]);
  const monthLabel = useMemo(
    () =>
      currentMonth.toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      }),
    [currentMonth]
  );

  const selectedStatus = selectedDateIso ? statuses[selectedDateIso] : null;
  const selectedIconKeys = useMemo(() => {
    if (!selectedDateIso) {
      return [];
    }

    const value = iconAssignments[selectedDateIso];
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      return [value];
    }

    return [];
  }, [iconAssignments, selectedDateIso]);
  const selectedRecords = selectedDateIso && recordsByDay[selectedDateIso] ? recordsByDay[selectedDateIso] : [];
  const selectedDateLabel = selectedDateIso ? formatDateForDisplay(selectedDateIso) : '';
  const selectedComment = useMemo(() => {
    if (!selectedDateIso) {
      return '';
    }

    const value = comments[selectedDateIso];
    return typeof value === 'string' ? value : '';
  }, [comments, selectedDateIso]);
  const [commentDraft, setCommentDraft] = useState('');
  const commentSaveTimeoutRef = useRef(null);
  const pendingCommentRef = useRef({ dateIso: null, value: '' });
  const hoverTimerRef = useRef(null);
  const [tooltipDateIso, setTooltipDateIso] = useState(null);

  const iconMap = useMemo(() => {
    const map = new Map();
    calendarIcons.forEach((icon) => {
      if (icon?.key && icon?.url) {
        map.set(icon.key, icon);
      }
    });
    return map;
  }, [calendarIcons]);

  const holidayIconMap = useMemo(() => {
    const map = new Map();
    calendarHolidayIcons.forEach((icon) => {
      if (icon?.key && icon?.url) {
        map.set(icon.key, icon);
      }
    });
    return map;
  }, [calendarHolidayIcons]);

  const getDayIconSet = useCallback(
    (iso) => {
      if (!iso) {
        return { display: [], extra: 0 };
      }

      const aggregatedIcons = [];
      const seen = new Set();

      const pushIcon = (icon) => {
        if (!icon || !icon.key || seen.has(icon.key)) {
          return;
        }
        seen.add(icon.key);
        aggregatedIcons.push(icon);
      };

      const assignedValue = iconAssignments[iso];
      const assignedKeys = Array.isArray(assignedValue)
        ? assignedValue
        : typeof assignedValue === 'string'
        ? [assignedValue]
        : [];

      assignedKeys.forEach((iconKey) => {
        const assignedIcon = iconMap.get(iconKey);
        if (assignedIcon?.url) {
          pushIcon({
            key: `assigned:${iconKey}`,
            uri: assignedIcon.url,
            storagePath: assignedIcon.storagePath,
            cacheKey: assignedIcon.key,
          });
        }
      });

      return {
        display: aggregatedIcons.slice(0, 4),
        extra: aggregatedIcons.length > 4 ? aggregatedIcons.length - 4 : 0,
      };
    },
    [iconAssignments, iconMap]
  );

  const applySelectedDate = useCallback(
    (date) => {
      if (!(date instanceof Date)) {
        return;
      }
      const iso = toISODate(date);
      if (!iso) {
        return;
      }
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      setSelectedDateIso(iso);
    },
    []
  );

  const handleSelectHoliday = useCallback(
    (holiday) => {
      if (!holiday) {
        return;
      }
      const normalized = ensureISODate(holiday.date);
      if (!normalized) {
        return;
      }
      const parsedDate = isoToDate(normalized);
      if (!parsedDate) {
        return;
      }
      applySelectedDate(parsedDate);
      setHolidaySearch('');
      setHolidayMenuVisible(false);
    },
    [applySelectedDate]
  );

  const handleSelectDay = (date) => {
    if (!(date instanceof Date)) {
      return;
    }
    applySelectedDate(date);
  };

  const persistComment = useCallback(
    (dateIso, rawValue) => {
      if (!isEditor) {
        return;
      }

      const normalizedDate = ensureISODate(dateIso);
      if (!normalizedDate) {
        return;
      }

      const normalizedValue = typeof rawValue === 'string' ? rawValue.trim() : '';
      const currentValue = comments[normalizedDate] || '';

      if (!normalizedValue) {
        if (!currentValue) {
          return;
        }
        clearCommentForDate(normalizedDate);
        return;
      }

      if (currentValue === normalizedValue) {
        return;
      }

      setCommentForDate(normalizedDate, normalizedValue);
    },
    [clearCommentForDate, comments, isEditor, setCommentForDate]
  );

  const flushPendingComment = useCallback(() => {
    if (commentSaveTimeoutRef.current) {
      clearTimeout(commentSaveTimeoutRef.current);
      commentSaveTimeoutRef.current = null;
    }

    const pending = pendingCommentRef.current;
    if (!pending || !pending.dateIso) {
      return;
    }

    persistComment(pending.dateIso, pending.value);
    pendingCommentRef.current = { dateIso: null, value: '' };
  }, [persistComment]);

  const handleChangeComment = useCallback(
    (value) => {
      setCommentDraft(value);

      if (!isEditor || !selectedDateIso) {
        return;
      }

      if (commentSaveTimeoutRef.current) {
        clearTimeout(commentSaveTimeoutRef.current);
        commentSaveTimeoutRef.current = null;
      }

      pendingCommentRef.current = { dateIso: selectedDateIso, value };
      commentSaveTimeoutRef.current = setTimeout(() => {
        const pending = pendingCommentRef.current;
        if (pending && pending.dateIso) {
          persistComment(pending.dateIso, pending.value);
        }
        pendingCommentRef.current = { dateIso: null, value: '' };
        commentSaveTimeoutRef.current = null;
      }, 600);
    },
    [isEditor, persistComment, selectedDateIso]
  );

  const handleClearComment = useCallback(() => {
    if (!isEditor || !selectedDateIso) {
      return;
    }

    if (commentSaveTimeoutRef.current) {
      clearTimeout(commentSaveTimeoutRef.current);
      commentSaveTimeoutRef.current = null;
    }
    pendingCommentRef.current = { dateIso: null, value: '' };
    setCommentDraft('');
    persistComment(selectedDateIso, '');
    setTooltipDateIso(null);
  }, [isEditor, persistComment, selectedDateIso]);

  const handleDayMouseEnter = useCallback(
    (iso) => {
      if (!iso) {
        return;
      }

      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }

      setTooltipDateIso(null);
      hoverTimerRef.current = setTimeout(() => {
        const commentValue = comments[iso];
        if (typeof commentValue === 'string' && commentValue.trim()) {
          setTooltipDateIso(iso);
        }
      }, 500);
    },
    [comments]
  );

  const handleDayMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    setTooltipDateIso(null);
  }, []);

  useEffect(() => {
    const requestedIso = ensureISODate(route?.params?.initialDate);
    if (!requestedIso) {
      return;
    }

    const requestedDate = isoToDate(requestedIso);
    if (!requestedDate) {
      return;
    }

    applySelectedDate(requestedDate);
    navigation.setParams({ initialDate: null });
  }, [route?.params?.initialDate, applySelectedDate, navigation]);

  useEffect(() => {
    setCommentDraft(selectedComment);
    pendingCommentRef.current = { dateIso: null, value: '' };
  }, [selectedComment]);

  useEffect(() => {
    flushPendingComment();
    setTooltipDateIso(null);
  }, [flushPendingComment, selectedDateIso]);

  useEffect(() => {
    return () => {
      flushPendingComment();
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
      setTooltipDateIso(null);
    };
  }, [flushPendingComment]);

  useEffect(() => {
    if (!tooltipDateIso) {
      return;
    }

    const commentValue = comments[tooltipDateIso];
    if (!commentValue || !commentValue.trim()) {
      setTooltipDateIso(null);
    }
  }, [comments, tooltipDateIso]);

  const handleChangeMonth = useCallback((offset) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  }, []);

  const handleSelectStatus = (statusKey) => {
    if (!selectedDateIso || !isEditor) {
      return;
    }

    if (selectedStatus === statusKey) {
      clearStatusForDate(selectedDateIso);
      return;
    }

    setStatusForDate(selectedDateIso, statusKey);
  };

  const handleSelectYear = useCallback((year) => {
    setCurrentMonth((prev) => new Date(year, prev.getMonth(), 1));
    setYearMenuVisible(false);
  }, []);

  const handleSelectMonthOption = useCallback((monthIndex) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), monthIndex, 1));
    setMonthMenuVisible(false);
  }, []);

  const handleClearIcons = useCallback(() => {
    if (!selectedDateIso || !isEditor) {
      return;
    }

    clearIconsForDate(selectedDateIso);
  }, [clearIconsForDate, isEditor, selectedDateIso]);

  const handleToggleIcon = useCallback(
    (iconKey) => {
      if (!selectedDateIso || !isEditor || !iconKey) {
        return;
      }

      if (selectedIconKeys.includes(iconKey)) {
        removeIconForDate(selectedDateIso, iconKey);
        return;
      }

      addIconForDate(selectedDateIso, iconKey);
    },
    [addIconForDate, isEditor, removeIconForDate, selectedDateIso, selectedIconKeys]
  );

  const openYearMenu = useCallback(() => {
    setYearMenuVisible(true);
  }, []);

  const closeYearMenu = useCallback(() => {
    setYearMenuVisible(false);
  }, []);

  const openMonthMenu = useCallback(() => {
    setMonthMenuVisible(true);
  }, []);

  const closeMonthMenu = useCallback(() => {
    setMonthMenuVisible(false);
  }, []);

  const openHolidayMenu = useCallback(() => {
    setHolidaySearch('');
    setHolidayMenuVisible(true);
  }, []);

  const closeHolidayMenu = useCallback(() => {
    setHolidayMenuVisible(false);
  }, []);

  const handleOpenFilters = () => {
    if (!selectedDateIso) {
      return;
    }

    navigation.navigate('RoomFilters', {
      dateIso: selectedDateIso,
      statusFilter: selectedStatus ?? 'all',
    });
  };

  const handleOpenRecord = useCallback(
    (record) => {
      if (!record) {
        return;
      }

      const recordId = typeof record.idList === 'string' ? record.idList.trim() : '';
      if (!recordId) {
        return;
      }

      navigation.navigate('Register', {
        recordIdList: recordId,
        fromCalendar: true,
      });
    },
    [navigation]
  );

  const renderWeekRow = (entry, weekIndex) => {
    const { week, showMonthLabel, monthShort, yearShort } = entry;
    return (
      <View key={`week-${weekIndex}`} style={styles.weekRow}>
        <View
          style={[
            styles.monthLabelCell,
            showMonthLabel ? styles.monthLabelCellVisible : styles.monthLabelCellSpacer,
          ]}
        >
          {showMonthLabel ? (
            <>
              <Text style={styles.monthLabelAbbrev}>{monthShort}</Text>
              <Text style={styles.monthLabelYear}>{yearShort}</Text>
            </>
          ) : null}
        </View>
        <View style={styles.weekDaysRow}>
          {week.map((date, index) => {
            if (!(date instanceof Date)) {
              return <View key={`empty-${weekIndex}-${index}`} style={[styles.dayCell, styles.dayCellEmpty]} />;
            }

            const iso = toISODate(date);
            const statusKey = iso ? statuses[iso] : null;
            const isSelected = iso === selectedDateIso;
            const dayRecords = iso ? recordsByDay[iso] || [] : [];
            const hasRecords = dayRecords.length > 0;
            const hasParty = dayRecords.some((record) => isPartyRecordCategory(record?.recordCategory));
            const statusColor = statusKey
              ? RECORD_STATUS_OPTIONS.find((option) => option.key === statusKey)?.color
              : undefined;
            const { display: dayIcons, extra: extraIcons } = getDayIconSet(iso);
            const hasActivity = hasRecords || Boolean(statusKey) || dayIcons.length > 0;
            const hoverHandlers =
              Platform.OS === 'web'
                ? {
                    onMouseEnter: () => handleDayMouseEnter(iso),
                    onMouseLeave: handleDayMouseLeave,
                  }
                : {};

            return (
              <TouchableOpacity
                key={`day-${iso}`}
                style={[
                  styles.dayCell,
                  hasParty && styles.dayCellParty,
                  !hasActivity && styles.dayCellQuiet,
                  isSelected && styles.dayCellSelected,
                ]}
                onPress={() => handleSelectDay(date)}
                {...hoverHandlers}
                accessibilityRole="button"
                accessibilityLabel={t('calendar.dayAccessibilityLabel', {
                  date: formatDateForDisplay(iso),
                })}
                accessibilityState={{ selected: isSelected }}
              >
                <View style={styles.dayBadgeWrapper}>
                  {tooltipDateIso === iso ? (
                    <View style={styles.dayCommentTooltipContainer} pointerEvents="none">
                      <View style={styles.dayCommentTooltip}>
                        <Text style={styles.dayCommentTooltipText}>{comments[iso]}</Text>
                      </View>
                      <View style={styles.dayCommentTooltipArrow} />
                    </View>
                  ) : null}
                  <View
                    style={[
                      styles.dayBadge,
                      statusColor && [styles.dayBadgeStatus, { backgroundColor: statusColor }],
                      !statusColor && hasActivity && styles.dayBadgeHasRecords,
                      isSelected && styles.dayBadgeSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isSelected && styles.dayTextSelected,
                        statusColor && styles.dayTextOnColored,
                      ]}
                    >
                      {date.getDate()}
                    </Text>
                  </View>
                </View>
                <View style={styles.dayIconsRow}>
                  {dayIcons.map((icon, iconIndex) => (
                    <View
                      key={`icon-${iso}-${icon.key ?? iconIndex}`}
                      style={[styles.dayIconWrapper, isSelected && styles.dayIconWrapperSelected]}
                    >
                      {icon.uri ? (
                        <CachedImage
                          uri={icon.uri}
                          storagePath={icon.storagePath}
                          cacheKey={icon.cacheKey}
                          style={styles.dayIcon}
                          resizeMode="contain"
                        />
                      ) : (
                        <Text style={styles.dayIconEmoji}>{icon.label}</Text>
                      )}
                    </View>
                  ))}
                  {extraIcons > 0 ? (
                    <View
                      style={[
                        styles.dayIconWrapper,
                        styles.dayIconMore,
                        isSelected && styles.dayIconWrapperSelected,
                      ]}
                      key={`extra-${iso}`}
                    >
                      <Text style={styles.dayIconMoreText}>{`+${extraIcons}`}</Text>
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.screenTitle}>{t('calendar.title')}</Text>

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleChangeMonth(-1)}
            accessibilityRole="button"
            accessibilityLabel={t('calendar.previousMonth')}
          >
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerMonthLabel}>{monthLabel}</Text>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleChangeMonth(1)}
            accessibilityRole="button"
            accessibilityLabel={t('calendar.nextMonth')}
          >
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.selectorToolbar}>
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={openYearMenu}
            accessibilityRole="button"
            accessibilityLabel={t('calendar.yearSelectorLabel')}
          >
            <Text style={styles.selectorButtonLabel}>{t('calendar.yearSelectorLabel')}</Text>
            <View style={styles.selectorButtonValueRow}>
              <Text style={styles.selectorButtonValue}>{currentYear}</Text>
              <Text style={styles.selectorButtonChevron}>⌄</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectorButton}
            onPress={openMonthMenu}
            accessibilityRole="button"
            accessibilityLabel={t('calendar.monthSelectorLabel')}
          >
            <Text style={styles.selectorButtonLabel}>{t('calendar.monthSelectorLabel')}</Text>
            <View style={styles.selectorButtonValueRow}>
              <Text style={styles.selectorButtonValue}>
                {currentMonthLongLabel || currentMonth.toLocaleDateString(undefined, { month: 'long' })}
              </Text>
              <Text style={styles.selectorButtonChevron}>⌄</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectorButton}
            onPress={openHolidayMenu}
            accessibilityRole="button"
            accessibilityLabel={t('calendar.holidaySelectorLabel')}
          >
            <Text style={styles.selectorButtonLabel}>{t('calendar.holidaySelectorLabel')}</Text>
            <View style={styles.selectorButtonValueRow}>
              <Text style={styles.selectorButtonValue}>
                {t('calendar.holidaySelectorPlaceholder')}
              </Text>
              <Text style={styles.selectorButtonChevron}>⌄</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.weekdaysRow}>
          <View style={styles.weekdayMonthSpacer} />
          {WEEKDAY_KEYS.map((key) => (
            <Text key={key} style={styles.weekdayText}>
              {t(`calendar.weekdays.${key}`)}
            </Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>{weeksWithMetadata.map(renderWeekRow)}</View>

        <View style={styles.legend}>
          <Text style={styles.legendTitle}>{t('calendar.legendTitle')}</Text>
          <View style={styles.legendRow}>
            {RECORD_STATUS_OPTIONS.map((option) => (
              <View key={option.key} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: option.color }]} />
                <Text style={styles.legendText}>{t(option.labelKey)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>{t('calendar.detailsTitle')}</Text>
          {selectedDateIso ? (
            <>
              <View style={styles.detailsHeaderRow}>
                <View style={styles.detailsHeaderInfo}>
                  <Text style={styles.detailsDate}>{selectedDateLabel}</Text>
                  <Text style={styles.detailsSummary}>
                    {selectedRecords.length === 0
                      ? t('calendar.noRecords')
                      : selectedRecords.length === 1
                      ? t('calendar.recordsSingle')
                      : t('calendar.recordsMultiple', { count: selectedRecords.length })}
                  </Text>
                </View>
                <View style={styles.statusControlsContainer}>
                  <Text style={styles.statusControlsLabel}>{t('calendar.statusLabel')}</Text>
                  {!isEditor ? (
                    <Text style={[styles.readOnlyMessage, styles.statusReadOnlyMessage]}>
                      {t('calendar.statusReadOnly')}
                    </Text>
                  ) : null}
                  <View style={[styles.statusOptionsRow, styles.statusOptionsRowCompact]}>
                    {RECORD_STATUS_OPTIONS.map((option) => {
                      const isActive = selectedStatus === option.key;
                      return (
                        <TouchableOpacity
                          key={option.key}
                          style={[
                            styles.statusOption,
                            { borderColor: option.color },
                            isActive && { backgroundColor: option.color },
                            !isEditor && styles.statusOptionDisabled,
                          ]}
                          onPress={() => handleSelectStatus(option.key)}
                          accessibilityRole="button"
                          accessibilityState={{ selected: isActive, disabled: !isEditor }}
                          disabled={!isEditor}
                        >
                          <Text
                            style={[
                              styles.statusOptionText,
                              isActive && styles.statusOptionTextActive,
                            ]}
                          >
                            {t(option.labelKey)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>

            {selectedRecords.length > 0 ? (
              <View style={styles.recordsSection}>
                <Text style={styles.sectionLabel}>{t('calendar.recordsLabel')}</Text>
                <View style={styles.recordsGrid}>
                  {selectedRecords.map((record, index) => {
                    const recordKey = record.idList ? `record-${record.idList}` : `record-${index}`;
                    const statusOption = resolveRecordStatusOption(record.status);
                    const statusLabel = statusOption
                      ? t(`table.statusBadge.${statusOption.key}`)
                      : record.status || t('filters.card.statusUnknown');
                    const formattedDates = formatStoredDateRanges(record.dates);
                    const recordName = record.nameFile || t('filters.card.noName');
                    const recordRoom = record.room || t('filters.card.noRoom');
                    const recordDates = formattedDates || t('filters.card.noDates');
                    const recordCategoryKey = getRecordCategoryKey(record.recordCategory);
                    const recordCategoryLabel =
                      recordCategoryKey === RECORD_CATEGORY.PARTY
                        ? t('calendar.recordCategoryParty')
                        : t('calendar.recordCategoryBase');
                    const canEdit = typeof record.idList === 'string' && record.idList.trim().length > 0;

                    return (
                      <TouchableOpacity
                        key={recordKey}
                        style={[styles.recordCard, !canEdit && styles.recordCardDisabled]}
                        onPress={() => handleOpenRecord(record)}
                        activeOpacity={0.85}
                        accessibilityRole="button"
                        accessibilityLabel={t('calendar.openRecord', { name: recordName })}
                        accessibilityState={{ disabled: !canEdit }}
                        disabled={!canEdit}
                      >
                        <View style={styles.recordImageWrapper}>
                          {record.image ? (
                          <CachedImage
                            uri={record.image}
                            storagePath={record.imageStoragePath}
                            style={styles.recordImage}
                            resizeMode="contain"
                          />
                          ) : (
                            <View style={styles.recordImagePlaceholder}>
                              <Text style={styles.recordImagePlaceholderText}>
                                {t('filters.card.noImage')}
                              </Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.recordInfo}>
                          <Text style={styles.recordLabel}>{t('filters.card.nameLabel')}</Text>
                          <Text style={styles.recordName} numberOfLines={2}>
                            {recordName}
                          </Text>

                          <View style={styles.recordDetailBlock}>
                            <Text style={styles.recordLabel}>{t('filters.card.roomLabel')}</Text>
                            <Text style={styles.recordValue} numberOfLines={2}>
                              {recordRoom}
                            </Text>
                          </View>

                          <View style={styles.recordDetailBlock}>
                            <Text style={styles.recordLabel}>{t('calendar.recordCategoryLabel')}</Text>
                            <View
                              style={[
                                styles.recordCategoryBadge,
                                recordCategoryKey === RECORD_CATEGORY.PARTY
                                  ? styles.recordCategoryBadgeParty
                                  : styles.recordCategoryBadgeBase,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.recordCategoryBadgeText,
                                  recordCategoryKey === RECORD_CATEGORY.PARTY &&
                                    styles.recordCategoryBadgeTextParty,
                                ]}
                              >
                                {recordCategoryLabel}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.recordDetailBlock}>
                            <Text style={styles.recordLabel}>{t('filters.card.datesLabel')}</Text>
                            <Text style={styles.recordValue} numberOfLines={2}>
                              {recordDates}
                            </Text>
                          </View>

                          <View style={styles.recordStatusRow}>
                            <Text style={[styles.recordLabel, styles.recordStatusLabel]}>
                              {t('filters.card.statusLabel')}
                            </Text>
                            <View
                              style={[
                                styles.recordStatusBadge,
                                statusOption
                                  ? { backgroundColor: statusOption.color }
                                  : styles.recordStatusBadgeFallback,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.recordStatusText,
                                  !statusOption && styles.recordStatusTextFallback,
                                ]}
                                numberOfLines={1}
                              >
                                {statusLabel}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ) : null}

            <Text style={styles.sectionLabel}>{t('calendar.iconLabel')}</Text>
            {!isEditor ? (
              <Text style={styles.readOnlyMessage}>{t('calendar.iconReadOnly')}</Text>
            ) : null}
            {calendarIcons.length === 0 ? (
              <Text style={styles.noIconsDefined}>{t('calendar.noIconsDefined')}</Text>
            ) : (
              <View style={styles.iconOptionsGrid}>
                <TouchableOpacity
                  style={[
                    styles.iconOption,
                    selectedIconKeys.length === 0 && styles.iconOptionActive,
                    !isEditor && styles.iconOptionDisabled,
                  ]}
                  onPress={handleClearIcons}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedIconKeys.length === 0, disabled: !isEditor }}
                  disabled={!isEditor}
                >
                  <View style={styles.iconPlaceholder}>
                    <Text style={styles.iconPlaceholderText}>{t('calendar.iconOptionNone')}</Text>
                  </View>
                </TouchableOpacity>
                {calendarIcons.map((icon) => {
                  const isActive = selectedIconKeys.includes(icon.key);
                  return (
                    <TouchableOpacity
                      key={icon.key}
                      style={[
                        styles.iconOption,
                        isActive && styles.iconOptionActive,
                        !isEditor && styles.iconOptionDisabled,
                      ]}
                      onPress={() => handleToggleIcon(icon.key)}
                      accessibilityRole="button"
                      accessibilityState={{ disabled: !isEditor, selected: isActive }}
                      disabled={!isEditor}
                    >
                      <CachedImage
                        uri={icon.url}
                        storagePath={icon.storagePath}
                        cacheKey={icon.key}
                        style={styles.iconOptionImage}
                        resizeMode="contain"
                      />
                      <Text
                        style={[
                          styles.iconOptionLabel,
                          isActive && styles.iconOptionLabelActive,
                        ]}
                        numberOfLines={2}
                      >
                        {icon.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            <Text style={styles.sectionLabel}>{t('calendar.commentLabel')}</Text>
            {isEditor ? (
              <View style={styles.commentEditor}>
                <TextInput
                  style={styles.commentInput}
                  value={commentDraft}
                  onChangeText={handleChangeComment}
                  placeholder={t('calendar.commentPlaceholder')}
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                {commentDraft.trim().length > 0 ? (
                  <TouchableOpacity
                    style={styles.commentClearButton}
                    onPress={handleClearComment}
                    accessibilityRole="button"
                    accessibilityLabel={t('calendar.commentClear')}
                  >
                    <Text style={styles.commentClearButtonText}>{t('calendar.commentClear')}</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : selectedComment ? (
              <View style={styles.commentReadOnlyContainer}>
                <Text style={styles.commentReadOnlyText}>{selectedComment}</Text>
              </View>
            ) : (
              <Text style={styles.commentEmptyText}>{t('calendar.commentEmpty')}</Text>
            )}
            {!isEditor ? <Text style={styles.readOnlyMessage}>{t('calendar.commentReadOnly')}</Text> : null}

            <TouchableOpacity
              style={[styles.filtersButton, !selectedDateIso && styles.filtersButtonDisabled]}
              onPress={handleOpenFilters}
              disabled={!selectedDateIso}
            >
              <Text style={styles.filtersButtonText}>{t('calendar.openFilters')}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.noSelection}>{t('calendar.noSelection')}</Text>
        )}
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={isHolidayMenuVisible}
        onRequestClose={closeHolidayMenu}
      >
        <View style={styles.selectorModalBackdrop}>
          <Pressable style={styles.selectorModalOverlay} onPress={closeHolidayMenu} />
          <View style={[styles.selectorModalCard, styles.holidayModalCard]}>
            <Text style={styles.selectorModalTitle}>{t('calendar.holidaySelectorTitle')}</Text>
            <TextInput
              style={styles.selectorSearchInput}
              value={holidaySearch}
              onChangeText={setHolidaySearch}
              placeholder={t('calendar.holidaySelectorSearchPlaceholder')}
              placeholderTextColor="#94a3b8"
            />
            <ScrollView style={styles.holidayList}>
              {filteredHolidayOptions.length === 0 ? (
                <Text style={styles.selectorModalEmptyText}>
                  {holidayOptions.length === 0
                    ? t('calendar.holidaySelectorEmpty')
                    : t('calendar.holidaySelectorNoResults')}
                </Text>
              ) : (
                filteredHolidayOptions.map((holiday) => {
                  const icon = holiday.iconKey
                    ? holidayIconMap.get(holiday.iconKey) || iconMap.get(holiday.iconKey)
                    : null;
                  return (
                    <TouchableOpacity
                      key={`holiday-option-${holiday.key}`}
                      style={styles.holidayOption}
                      onPress={() => handleSelectHoliday(holiday)}
                      accessibilityRole="button"
                    >
                      <View style={styles.holidayOptionIcon}>
                        {icon?.url ? (
                          <CachedImage
                            uri={icon.url}
                            storagePath={icon.storagePath}
                            cacheKey={icon.key}
                            style={styles.holidayOptionImage}
                            resizeMode="contain"
                          />
                        ) : (
                          <View style={styles.holidayOptionPlaceholder}>
                            <Text style={styles.holidayOptionPlaceholderText}>☆</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.holidayOptionInfo}>
                        <Text style={styles.holidayOptionName}>{holiday.name}</Text>
                        <Text style={styles.holidayOptionDate}>
                          {formatDateForDisplay(holiday.date) || holiday.date}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.selectorModalClose}
              onPress={closeHolidayMenu}
              accessibilityRole="button"
            >
              <Text style={styles.selectorModalCloseText}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={isYearMenuVisible}
        onRequestClose={closeYearMenu}
      >
        <View style={styles.selectorModalBackdrop}>
          <Pressable style={styles.selectorModalOverlay} onPress={closeYearMenu} />
          <View style={styles.selectorModalCard}>
            <Text style={styles.selectorModalTitle}>{t('calendar.yearSelectorTitle')}</Text>
            <View style={styles.selectorModalOptionsColumn}>
              {YEAR_OPTIONS.map((year) => {
                const isActive = year === currentYear;
                return (
                  <TouchableOpacity
                    key={`year-modal-${year}`}
                    style={[
                      styles.selectorModalOption,
                      styles.selectorModalOptionFull,
                      isActive && styles.selectorModalOptionActive,
                    ]}
                    onPress={() => handleSelectYear(year)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                  >
                    <Text
                      style={[styles.selectorModalOptionText, isActive && styles.selectorModalOptionTextActive]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity
              style={styles.selectorModalClose}
              onPress={closeYearMenu}
              accessibilityRole="button"
            >
              <Text style={styles.selectorModalCloseText}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={isMonthMenuVisible}
        onRequestClose={closeMonthMenu}
      >
        <View style={styles.selectorModalBackdrop}>
          <Pressable style={styles.selectorModalOverlay} onPress={closeMonthMenu} />
          <View style={styles.selectorModalCard}>
            <Text style={styles.selectorModalTitle}>{t('calendar.monthSelectorTitle')}</Text>
            <View style={styles.selectorModalGrid}>
              {monthOptions.map((option) => {
                const isActive = option.index === currentMonthIndex;
                return (
                  <TouchableOpacity
                    key={`month-modal-${option.index}`}
                    style={[
                      styles.selectorModalOption,
                      styles.selectorModalOptionGrid,
                      isActive && styles.selectorModalOptionActive,
                    ]}
                    onPress={() => handleSelectMonthOption(option.index)}
                    accessibilityRole="button"
                    accessibilityLabel={option.longLabel}
                    accessibilityState={{ selected: isActive }}
                  >
                    <Text
                      style={[styles.selectorModalOptionText, isActive && styles.selectorModalOptionTextActive]}
                    >
                      {option.longLabel}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity
              style={styles.selectorModalClose}
              onPress={closeMonthMenu}
              accessibilityRole="button"
            >
              <Text style={styles.selectorModalCloseText}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 48,
    backgroundColor: '#f8fafc',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  navButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 24,
    marginTop: -2,
  },
  headerMonthLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    textTransform: 'capitalize',
  },
  selectorToolbar: {
    flexDirection: 'row',
    columnGap: 12,
    marginBottom: 20,
  },
  selectorButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  selectorButtonLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  selectorButtonValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorButtonValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    textTransform: 'capitalize',
  },
  selectorButtonChevron: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
  },
  selectorModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  selectorModalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  selectorModalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 6,
  },
  holidayModalCard: {
    maxWidth: 420,
  },
  selectorModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  selectorSearchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  selectorModalOptionsColumn: {
    flexDirection: 'column',
    rowGap: 8,
    marginBottom: 16,
  },
  selectorModalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 8,
    rowGap: 8,
    marginBottom: 16,
  },
  selectorModalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorModalOptionFull: {
    alignSelf: 'stretch',
  },
  selectorModalOptionGrid: {
    flexGrow: 1,
    flexBasis: '48%',
  },
  selectorModalOptionActive: {
    borderColor: '#1d4ed8',
    backgroundColor: '#dbeafe',
  },
  selectorModalOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  selectorModalOptionTextActive: {
    color: '#1d4ed8',
  },
  selectorModalEmptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    paddingVertical: 24,
  },
  selectorModalClose: {
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 9999,
    backgroundColor: '#1d4ed8',
  },
  selectorModalCloseText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  holidayList: {
    maxHeight: 360,
    marginBottom: 16,
  },
  holidayOption: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  holidayOptionIcon: {
    width: 96,
    aspectRatio: 2,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  holidayOptionImage: {
    width: '100%',
    height: '100%',
  },
  holidayOptionPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e2e8f0',
  },
  holidayOptionPlaceholderText: {
    color: '#475569',
    fontSize: 20,
    fontWeight: '700',
  },
  holidayOptionInfo: {
    flex: 1,
  },
  holidayOptionName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  holidayOptionDate: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
  },
  weekdaysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weekdayMonthSpacer: {
    width: 68,
    marginRight: 8,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  calendarGrid: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 8,
  },
  monthLabelCell: {
    width: 68,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
  },
  monthLabelCellSpacer: {
    opacity: 0,
  },
  monthLabelCellVisible: {
    backgroundColor: '#dbeafe',
  },
  monthLabelAbbrev: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e3a8a',
    textTransform: 'uppercase',
  },
  monthLabelYear: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
    marginTop: 2,
  },
  weekDaysRow: {
    flexDirection: 'row',
    flex: 1,
  },
  dayCell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 96,
    borderRadius: 14,
  },
  dayCellSelected: {
    borderWidth: 2,
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  dayCellParty: {
    backgroundColor: '#fef3c7',
  },
  dayCellQuiet: {
    backgroundColor: '#f8fafc',
  },
  dayCellEmpty: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    backgroundColor: 'transparent',
  },
  dayBadgeWrapper: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  dayBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5f5',
  },
  dayBadgeSelected: {
    borderWidth: 2,
    borderColor: '#1d4ed8',
  },
  dayBadgeHasRecords: {
    backgroundColor: '#dbeafe',
  },
  dayBadgeStatus: {
    borderColor: 'transparent',
  },
  dayText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  dayTextSelected: {
    color: '#1d4ed8',
  },
  dayTextOnColored: {
    color: '#fff',
  },
  dayIconsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  dayIconWrapper: {
    width: 30,
    height: 30,
    margin: 2,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5f5',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 2,
  },
  dayIconWrapperSelected: {
    borderColor: '#2563eb',
  },
  dayIcon: {
    width: '100%',
    height: '100%',
  },
  dayIconEmoji: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  dayIconMore: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  dayIconMoreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  dayCommentTooltipContainer: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    zIndex: 10,
  },
  dayCommentTooltip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#cbd5f5',
    shadowColor: '#0f172a',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 8,
    ...Platform.select({
      web: {
        width: 'max-content',
        maxWidth: 'none',
      },
    }),
  },
  dayCommentTooltipArrow: {
    width: 12,
    height: 12,
    marginTop: -6,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#cbd5f5',
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },
  dayCommentTooltipText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    textAlign: 'left',
    ...Platform.select({
      web: {
        whiteSpace: 'pre',
      },
    }),
  },
  legend: {
    marginTop: 24,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#334155',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  detailsHeaderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    columnGap: 24,
    rowGap: 16,
    marginBottom: 24,
  },
  detailsHeaderInfo: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 200,
  },
  detailsDate: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  detailsSummary: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 0,
  },
  statusControlsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    flexShrink: 1,
    minWidth: 220,
    maxWidth: '100%',
    rowGap: 8,
  },
  statusControlsLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'right',
  },
  recordsSection: {
    marginBottom: 24,
  },
  recordsGrid: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: -6,
  },
  recordCard: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '23%',
    maxWidth: '23%',
    minWidth: 200,
    marginHorizontal: 6,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  recordCardDisabled: {
    opacity: 0.6,
    ...Platform.select({ web: { cursor: 'not-allowed' } }),
  },
  recordImageWrapper: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  recordImage: {
    width: '100%',
    height: '100%',
  },
  recordImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  recordImagePlaceholderText: {
    fontSize: 13,
    color: '#475569',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  recordInfo: {
    paddingTop: 4,
  },
  recordLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  recordName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  recordStatusLabel: {
    marginBottom: 0,
  },
  recordDetailBlock: {
    marginTop: 6,
  },
  recordValue: {
    fontSize: 14,
    color: '#1f2937',
    marginTop: 4,
  },
  recordCategoryBadge: {
    alignSelf: 'flex-start',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 4,
  },
  recordCategoryBadgeBase: {
    backgroundColor: '#bfdbfe',
  },
  recordCategoryBadgeParty: {
    backgroundColor: '#f97316',
  },
  recordCategoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#0f172a',
  },
  recordCategoryBadgeTextParty: {
    color: '#fff7ed',
  },
  recordStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 12,
    marginTop: 8,
  },
  recordStatusBadge: {
    borderRadius: 9999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  recordStatusBadgeFallback: {
    backgroundColor: '#e2e8f0',
  },
  recordStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
  recordStatusTextFallback: {
    color: '#0f172a',
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  statusOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  statusOptionsRowCompact: {
    marginBottom: 0,
  },
  statusOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  statusOptionDisabled: {
    opacity: 0.5,
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  statusOptionTextActive: {
    color: '#fff',
  },
  noIconsDefined: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 20,
  },
  iconOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  iconOption: {
    width: 84,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  iconOptionActive: {
    borderColor: '#2563eb',
    backgroundColor: '#dbeafe',
  },
  iconOptionDisabled: {
    opacity: 0.5,
  },
  iconOptionImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f1f5f9',
  },
  iconOptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  iconOptionLabelActive: {
    color: '#1d4ed8',
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconPlaceholderText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  commentEditor: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 16,
  },
  commentInput: {
    minHeight: 96,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  commentClearButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: '#dc2626',
  },
  commentClearButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  commentReadOnlyContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 8,
  },
  commentReadOnlyText: {
    fontSize: 14,
    color: '#0f172a',
    lineHeight: 20,
  },
  commentEmptyText: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 8,
  },
  readOnlyMessage: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },
  statusReadOnlyMessage: {
    marginBottom: 0,
    textAlign: 'right',
  },
  filtersButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  filtersButtonDisabled: {
    opacity: 0.5,
  },
  filtersButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  noSelection: {
    fontSize: 15,
    color: '#475569',
  },
});
