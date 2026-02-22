import { getJson, getSettings, post } from "./common-static.js";

const timelineApi = (window as any).api;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

function getFullDate({ day, month, year }: { day: number, month: number, year?: number }, useYear: boolean = false) {
  const yearStr = (year === undefined && useYear) ? '' : `, ${year}`;
  return `${MONTHS[month - 1]} ${day}` + yearStr;
}

function getDescription(version: DateInfo): string {
  return `
  <div class="date-description">
    <div>
    On this day
    </div>
    <div>
      ${version.events.map((item) => {
        return `
        <div class="event-description-listing">
          <img class="day-icon" src="${item.image}.png" />
          <div class="event-description">
            ${item.text}
          </div>
        </div>
        `
      }).join('')}
    </div>
  </div>
  `;
}

// saving selected version globally
let currentVersion = '';

const timelineElement = document.getElementById('timeline')!;
const yearElement = document.getElementById('year')! as HTMLSelectElement;
const monthElement = document.getElementById('month')! as HTMLSelectElement;

function setSelectElements(month: number, year: number) {
  monthElement.value = MONTHS[month - 1];
  yearElement.value = String(year);
}

type Event = {
  text: string;
  image: string
  party?: 'start' | 'end'
};

/** Basic unit of information about a singular day in the timeline */
type DateInfo = {
  day: number;
  month: number;
  year: number;
  events: Event[];
  selected?: boolean;
  inParty: boolean;
};

type PartyInfo = {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  startDay: DateInfo;
};

function getPartyId(title: string, startDate: string): string {
  return `${title.toLowerCase()}::${startDate}`;
}

function stripHtml(html: string): string {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html').body.textContent?.trim() ?? html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizePartyTitle(text: string): string {
  const plainText = stripHtml(text)
    .replace(/\s+/g, ' ')
    .replace(/\b(starts?|begins?|ends?)\b/gi, '')
    .replace(/\s+-\s+/g, ' ')
    .trim();

  return plainText.length > 0 ? plainText : 'Unnamed Party';
}

function buildPartyIndex(days: DateInfo[]): PartyInfo[] {
  const sortedDays = [...days].sort((a, b) => {
    return getDateFromDateInfo(a).getTime() - getDateFromDateInfo(b).getTime();
  });
  const activeParties: Record<string, PartyInfo[]> = {};
  const parties: PartyInfo[] = [];

  for (const day of sortedDays) {
    const date = getDateFormat(day);

    day.events.forEach((event) => {
      if (event.party === undefined) {
        return;
      }

      const partyTitle = normalizePartyTitle(event.text);
      const key = partyTitle.toLowerCase();

      if (event.party === 'start') {
        const partyInfo: PartyInfo = {
          id: getPartyId(partyTitle, date),
          title: partyTitle,
          startDate: date,
          startDay: day,
        };

        if (activeParties[key] === undefined) {
          activeParties[key] = [];
        }
        activeParties[key].push(partyInfo);
        parties.push(partyInfo);
      }

      if (event.party === 'end') {
        const activeList = activeParties[key];
        const partyToClose = activeList?.shift();
        if (partyToClose !== undefined) {
          partyToClose.endDate = date;
        }
      }
    });
  }

  return parties.sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });
}

function getPartyDisplayName(party: PartyInfo): string {
  const startInfo = getDateInfo(party.startDate);
  return `${party.title} (${startInfo.year})`;
}

function getPartySubtitle(party: PartyInfo): string {
  const startInfo = getDateInfo(party.startDate);
  const startText = getFullDate(startInfo, true);
  if (party.endDate === undefined) {
    return `Started on ${startText}`;
  }

  const endInfo = getDateInfo(party.endDate);
  return `${startText} → ${getFullDate(endInfo, true)}`;
}

function getPartySearchScore(query: string, party: PartyInfo): number {
  const normalizedQuery = query.toLowerCase();
  const title = party.title.toLowerCase();
  const subtitle = getPartySubtitle(party).toLowerCase();

  if (title === normalizedQuery) {
    return 100;
  }
  if (title.startsWith(normalizedQuery)) {
    return 80;
  }
  if (title.includes(normalizedQuery)) {
    return 60;
  }
  if (subtitle.includes(normalizedQuery)) {
    return 40;
  }

  return 0;
}

function setupBitacora(days: DateInfo[]) {
  const partyFavorites = new Set<string>();
  const partyIndex = buildPartyIndex(days);

  const DAY_COMMENT_STORAGE_KEY = 'timeline-bitacora-comments';
  const PARTY_COMMENT_STORAGE_KEY = 'timeline-bitacora-party-comments';
  const LAST_PENGUIN_STORAGE_KEY = 'timeline-bitacora-last-penguin';

  type ActivePenguin = { id: number; name: string; };

  const dayComments: Record<string, string> = {};
  const partyComments: Record<string, string> = {};
  let activePenguin: ActivePenguin | null = null;
  let saveCommentsTimeout: NodeJS.Timeout | undefined;

  const assignComments = (target: Record<string, string>, source: Record<string, string>) => {
    Object.keys(target).forEach((key) => {
      delete target[key];
    });
    Object.entries(source).forEach(([key, value]) => {
      if (typeof value === 'string' && value.trim().length > 0) {
        target[key] = value;
      }
    });
  };

  const readLastPenguinFromStorage = (): ActivePenguin | null => {
    try {
      const raw = localStorage.getItem(LAST_PENGUIN_STORAGE_KEY);
      if (raw === null) {
        return null;
      }
      const parsed = JSON.parse(raw) as { id?: unknown; name?: unknown; };
      if (typeof parsed.id !== 'number' || !Number.isInteger(parsed.id) || parsed.id <= 0) {
        return null;
      }
      if (typeof parsed.name !== 'string' || parsed.name.trim().length === 0) {
        return null;
      }
      return { id: parsed.id, name: parsed.name };
    } catch (_error) {
      return null;
    }
  };

  const persistLastPenguin = (penguin: ActivePenguin) => {
    localStorage.setItem(LAST_PENGUIN_STORAGE_KEY, JSON.stringify(penguin));
  };

  const getActivePenguin = async (): Promise<ActivePenguin | null> => {
    const players = await getJson('players') as Array<{ id: number; name: string; }>;
    if (Array.isArray(players) && players.length > 0 && typeof players[0].id === 'number' && typeof players[0].name === 'string') {
      activePenguin = { id: players[0].id, name: players[0].name };
      persistLastPenguin(activePenguin);
      return activePenguin;
    }

    if (activePenguin !== null) {
      return activePenguin;
    }

    activePenguin = readLastPenguinFromStorage();
    return activePenguin;
  };

  const queueCommentsSave = () => {
    if (saveCommentsTimeout !== undefined) {
      clearTimeout(saveCommentsTimeout);
    }

    saveCommentsTimeout = setTimeout(async () => {
      try {
        const currentPenguin = await getActivePenguin();
        if (currentPenguin === null) {
          return;
        }

        await post('timeline-comments/save', {
          penguinId: currentPenguin.id,
          dayComments,
          partyComments,
          favoriteParties: Array.from(partyFavorites.values())
        });
      } catch (_error) {
        statusElement.innerText = 'Could not sync notes to data storage.';
      }
    }, 120);
  };

  const loadCommentsFromServer = async () => {
    const currentPenguin = await getActivePenguin();
    if (currentPenguin === null) {
      updateActivePenguinUI();
      updateCommentAvailability();
      statusElement.innerText = 'Log in with a penguin to sync and save your notes.';
      return;
    }

    const data = await getJson(`timeline-comments/get/${currentPenguin.id}`) as {
      dayComments?: Record<string, string>;
      partyComments?: Record<string, string>;
      favoriteParties?: string[];
    };

    assignComments(dayComments, data.dayComments ?? {});
    assignComments(partyComments, data.partyComments ?? {});
    partyFavorites.clear();
    (data.favoriteParties ?? []).forEach((partyId) => {
      if (typeof partyId === 'string') {
        partyFavorites.add(partyId);
      }
    });

    updateActivePenguinUI();
    updateCommentAvailability();
    renderParties();
    renderDetails();
  };
  const dayMap: Record<string, DateInfo> = {};
  days.forEach((day) => {
    dayMap[getDateFormat(day)] = day;
  });

  let selectedEntry: { date: string; title: string; description: string; detailsHtml: string; } | null = null;
  let selectedParty: PartyInfo | null = null;
  let usePartyComment = false;
  const partyById: Record<string, PartyInfo> = {};
  partyIndex.forEach((party) => {
    partyById[party.id] = party;
  });

  timelineElement.innerHTML = `
  <div class="bitacora-layout">
    <div class="bitacora-card">
      <div class="bitacora-title">📚 Party Logbook</div>
      <div class="bitacora-input-row">
        <input id="bitacora-party-search" class="party-search" type="search" placeholder="Search for a party (Music Jam, Halloween, Holiday...)" />
        <label class="favorites-filter" for="bitacora-favorites-only">
          <input id="bitacora-favorites-only" type="checkbox" />
          <span>❤️ Favorites only</span>
        </label>
      </div>
      <div class="bitacora-title">🎉 Parties</div>
      <div id="bitacora-party-results" class="bitacora-results"></div>
    </div>
    <div class="bitacora-card">
      <div class="bitacora-details-head-row">
        <div id="bitacora-details-head" class="bitacora-details-head">Select a party to open your logbook ✍️</div>
        <div class="bitacora-details-meta">
          <div id="bitacora-active-penguin" class="bitacora-active-penguin">🐧 Logbook owner: none</div>
          <button id="bitacora-mode-party" class="bitacora-mode-button" title="Toggle party-wide note mode">🎉 Party note</button>
        </div>
      </div>
      <div id="bitacora-details-body"></div>
      <textarea id="bitacora-comment-box" class="bitacora-comment-box" placeholder="Write a note for this specific day..."></textarea>
      <div id="bitacora-status" class="bitacora-status">Auto-save enabled. Your notes are saved instantly.</div>
    </div>
  </div>
  `;

  window.scrollTo({ top: 0, behavior: 'auto' });

  const as3Footer = document.getElementById('as3-footer');
  if (as3Footer !== null) {
    as3Footer.innerHTML = '';
  }

  activePenguin = readLastPenguinFromStorage();

  const partySearchElement = document.getElementById('bitacora-party-search') as HTMLInputElement;
  const favoriteOnlyToggleElement = document.getElementById('bitacora-favorites-only') as HTMLInputElement;
  const partyResultsElement = document.getElementById('bitacora-party-results') as HTMLDivElement;
  const commentBox = document.getElementById('bitacora-comment-box') as HTMLTextAreaElement;
  const detailsHead = document.getElementById('bitacora-details-head') as HTMLDivElement;
  const detailsBody = document.getElementById('bitacora-details-body') as HTMLDivElement;
  const statusElement = document.getElementById('bitacora-status') as HTMLDivElement;
  const partyModeButton = document.getElementById('bitacora-mode-party') as HTMLButtonElement;
  const activePenguinElement = document.getElementById('bitacora-active-penguin') as HTMLDivElement;

  const updateActivePenguinUI = () => {
    if (activePenguin === null) {
      activePenguinElement.innerText = '🐧 Logbook owner: none';
    } else {
      activePenguinElement.innerText = `🐧 Logbook owner: ${activePenguin.name}`;
    }
  };

  const updateCommentAvailability = () => {
    const canComment = activePenguin !== null;
    commentBox.disabled = !canComment;
    if (!canComment) {
      commentBox.value = '';
      commentBox.placeholder = 'Log in (or use last penguin) to write notes.';
    }
  };

  const updateModeButtonState = () => {
    const partyHasComment = selectedParty !== null && hasCommentValue(partyComments[selectedParty.id]);
    const commentBadge = partyHasComment
      ? '<span class="bitacora-button-comment-badge" aria-label="Party note exists">💬</span>'
      : '';
    partyModeButton.innerHTML = `${commentBadge}<span>🎉 Party note</span>`;
    partyModeButton.classList.toggle('active', usePartyComment);
    partyModeButton.disabled = selectedParty === null || activePenguin === null;
    partyModeButton.setAttribute('aria-pressed', usePartyComment ? 'true' : 'false');
  };

  const getCurrentCommentContext = (): { storageKey: string; key: string; label: string; } | null => {
    if (selectedEntry === null) {
      return null;
    }

    if (usePartyComment) {
      if (selectedParty === null) {
        return null;
      }
      return {
        storageKey: PARTY_COMMENT_STORAGE_KEY,
        key: selectedParty.id,
        label: `party ${getPartyDisplayName(selectedParty)}`
      };
    }

    return {
      storageKey: DAY_COMMENT_STORAGE_KEY,
      key: selectedEntry.date,
      label: `day ${getFullDate(getDateInfo(selectedEntry.date), true)}`
    };
  };

  const hasCommentValue = (value: string | undefined): boolean => {
    return value !== undefined && value.trim().length > 0;
  };

  const readCurrentCommentValue = (): string => {
    const context = getCurrentCommentContext();
    if (context === null) {
      return '';
    }
    if (context.storageKey === PARTY_COMMENT_STORAGE_KEY) {
      return partyComments[context.key] ?? '';
    }
    return dayComments[context.key] ?? '';
  };

  const persistCurrentComment = () => {
    if (activePenguin === null) {
      statusElement.innerText = 'Log in with a penguin to save notes.';
      return;
    }

    const context = getCurrentCommentContext();
    if (context === null) {
      return;
    }

    const value = commentBox.value;
    if (context.storageKey === PARTY_COMMENT_STORAGE_KEY) {
      if (value.trim().length === 0) {
        delete partyComments[context.key];
      } else {
        partyComments[context.key] = value;
      }
      queueCommentsSave();
    } else {
      if (value.trim().length === 0) {
        delete dayComments[context.key];
      } else {
        dayComments[context.key] = value;
      }
      queueCommentsSave();
    }

    statusElement.innerText = `Auto-saved ${context.label} note.`;
  };


  const updateSelectedDayCommentBadge = () => {
    if (selectedEntry === null || usePartyComment) {
      return;
    }

    const dayButton = detailsBody.querySelector(`[data-party-date="${selectedEntry.date}"]`);
    if (!(dayButton instanceof HTMLButtonElement)) {
      return;
    }

    const hasComment = hasCommentValue(dayComments[selectedEntry.date]);
    dayButton.classList.toggle('mini-day-button-commented', hasComment);

    const existingBadge = dayButton.querySelector('.mini-day-comment-badge');
    if (hasComment && existingBadge === null) {
      dayButton.insertAdjacentHTML('afterbegin', '<span class="mini-day-comment-badge" aria-label="Has note">💬</span>');
    } else if (!hasComment && existingBadge !== null) {
      existingBadge.remove();
    }
  };

  const refreshCommentEditor = () => {
    updateActivePenguinUI();
    updateCommentAvailability();
    updateModeButtonState();
    commentBox.placeholder = usePartyComment
      ? 'Write a global note for this party...'
      : 'Write a note for this specific day...';
    commentBox.value = readCurrentCommentValue();
    if (activePenguin === null) {
      statusElement.innerText = 'Log in with a penguin to save notes.';
    } else {
      statusElement.innerText = usePartyComment
        ? 'Party note mode active (auto-save enabled).'
        : 'Day note mode active (auto-save enabled).';
    }
  };

  commentBox.addEventListener('input', () => {
    persistCurrentComment();
    updateSelectedDayCommentBadge();
    updateModeButtonState();
    renderParties();
  });

  const getPartyDates = (party: PartyInfo): string[] => {
    const datesInRange: string[] = [];
    const endDate = party.endDate ?? party.startDate;
    const startParts = getDateInfo(party.startDate);
    const endParts = getDateInfo(endDate);
    const startDate = new Date(startParts.year, startParts.month - 1, startParts.day);
    const finalDate = new Date(endParts.year, endParts.month - 1, endParts.day);

    for (let date = new Date(startDate); date <= finalDate; date.setDate(date.getDate() + 1)) {
      const dateStr = getDateFormat({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      });

      // only keep days that are actually registered in timeline data
      if (dayMap[dateStr] !== undefined) {
        datesInRange.push(dateStr);
      }
    }

    return datesInRange.length > 0 ? datesInRange : [party.startDate];
  };

  const partyHasAnyComment = (party: PartyInfo): boolean => {
    if (hasCommentValue(partyComments[party.id])) {
      return true;
    }

    const partyDates = getPartyDates(party);
    return partyDates.some((date) => hasCommentValue(dayComments[date]));
  };

  const getDayDescriptionForBitacora = (date: string): string => {
    const day = dayMap[date];
    if (day === undefined) {
      return '<div class="party-result-subtitle">This day is not registered in the timeline.</div>';
    }
    return getDescription(day);
  };

  const renderDetails = () => {
    if (selectedEntry === null) {
      detailsHead.innerText = 'Select a party to open your logbook ✍️';
      detailsBody.innerHTML = '';
      commentBox.value = '';
      return;
    }

    detailsHead.innerText = selectedEntry.title;

    const miniCalendarHtml = selectedParty === null ? '' : (() => {
      const partyDates = getPartyDates(selectedParty);
      const modeHint = usePartyComment
        ? '<div class="bitacora-mini-calendar-mode">Party note mode is active. Select a day chip to switch back to day notes.</div>'
        : '';
      return `
      <div class="bitacora-mini-calendar">
        <div class="bitacora-mini-calendar-title">Select the exact day of the party:</div>
        ${modeHint}
        <div class="bitacora-mini-calendar-grid">
          ${partyDates.map((date) => {
            const parsedDate = getDateInfo(date);
            const selectedClass = (!usePartyComment && selectedEntry?.date === date) ? 'selected-mini-day' : '';
            const commentedClass = hasCommentValue(dayComments[date]) ? 'mini-day-button-commented' : '';
            const commentBadge = hasCommentValue(dayComments[date])
              ? '<span class="mini-day-comment-badge" aria-label="Has note">💬</span>'
              : '';
            return `<button class="mini-day-button ${selectedClass} ${commentedClass}" data-party-date="${date}">${commentBadge}<span>${parsedDate.day} ${MONTHS[parsedDate.month - 1].slice(0, 3)}</span></button>`;
          }).join('')}
        </div>
      </div>`;
    })();

    detailsBody.innerHTML = `
      <div class="party-result-subtitle bitacora-description">${escapeHtml(selectedEntry.description)}</div>
      ${miniCalendarHtml}
      ${selectedEntry.detailsHtml}
    `;

    detailsBody.querySelectorAll('[data-party-date]').forEach((button) => {
      button.addEventListener('click', async () => {
        if (!(button instanceof HTMLElement)) {
          return;
        }
        const date = button.dataset.partyDate;
        if (date === undefined || selectedParty === null) {
          return;
        }

        usePartyComment = false;
        await openEntry(
          date,
          `🎉 ${getPartyDisplayName(selectedParty)}`,
          `${getPartySubtitle(selectedParty)} · Selected day: ${getFullDate(getDateInfo(date), true)}`,
          getDayDescriptionForBitacora(date),
          selectedParty
        );
      });
    });

    refreshCommentEditor();
  };

  const openEntry = async (
    date: string,
    title: string,
    description: string,
    detailsHtml: string,
    partyForCalendar: PartyInfo | null = null
  ) => {
    selectedEntry = { date, title, description, detailsHtml };
    selectedParty = partyForCalendar;
    usePartyComment = false;
    const { month, year } = getDateInfo(date);
    setSelectElements(month, year);
    await updateVersion(date);
    renderDetails();
  };

  const renderParties = () => {
    const query = partySearchElement.value.trim();
    const onlyFavorites = favoriteOnlyToggleElement.checked;

    let filteredParties = partyIndex;
    if (onlyFavorites) {
      filteredParties = filteredParties.filter((party) => partyFavorites.has(party.id));
    }

    if (query.length > 0) {
      filteredParties = filteredParties
        .map((party) => ({ party, score: getPartySearchScore(query, party) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ party }) => party);
    } else {
      // default sort: favorites first, then newest first (existing order)
      filteredParties = [...filteredParties].sort((a, b) => {
        return Number(partyFavorites.has(b.id)) - Number(partyFavorites.has(a.id));
      });
    }

    const matches = filteredParties.slice(0, 15);

    if (matches.length === 0) {
      partyResultsElement.innerHTML = `<div class="party-result-item"><div class="party-result-content"><div class="party-result-title">No parties found</div><div class="party-result-subtitle">Try another keyword or disable the favorites filter.</div></div></div>`;
      return;
    }

    partyResultsElement.innerHTML = matches.map((party) => {
      const heart = partyFavorites.has(party.id) ? '❤️' : '♡';
      const hasAnyNote = partyHasAnyComment(party);
      const noteIndicator = hasAnyNote
        ? '<span class="party-note-indicator" aria-label="This party has notes">💬</span>'
        : '';
      return `
      <div class="party-result-item" data-party-id="${party.id}" data-date="${party.startDate}">
        <div class="party-result-content">
          <div class="party-result-title">${escapeHtml(getPartyDisplayName(party))}</div>
          <div class="party-result-subtitle">${escapeHtml(getPartySubtitle(party))}</div>
        </div>
        <div class="party-result-actions">
          ${noteIndicator}
          <button class="favorite-heart-button" data-favorite-toggle="true" data-party-id="${party.id}">${heart}</button>
        </div>
      </div>`;
    }).join('');

  };

  partyResultsElement.addEventListener('click', async (event) => {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    const targetItem = event.target.closest('.party-result-item');
    if (!(targetItem instanceof HTMLElement)) {
      return;
    }

    const partyId = targetItem.dataset.partyId;
    if (partyId === undefined) {
      return;
    }

    if (event.target.dataset.favoriteToggle === 'true') {
      event.stopPropagation();
      if (activePenguin === null) {
        statusElement.innerText = 'Log in with a penguin to manage favorite parties.';
        return;
      }

      if (partyFavorites.has(partyId)) {
        partyFavorites.delete(partyId);
      } else {
        partyFavorites.add(partyId);
      }
      queueCommentsSave();
      renderParties();
      return;
    }

    const party = partyById[partyId];
    if (party === undefined) {
      return;
    }

    await openEntry(
      party.startDate,
      `🎉 ${getPartyDisplayName(party)}`,
      getPartySubtitle(party),
      getDayDescriptionForBitacora(party.startDate),
      party
    );
  });

  partyModeButton.onclick = () => {
    if (selectedParty === null) {
      statusElement.innerText = 'Select a party first to use party-level notes.';
      return;
    }

    usePartyComment = !usePartyComment;
    statusElement.innerText = usePartyComment
      ? 'Party note mode enabled. Select any day chip to switch back to day notes.'
      : 'Day note mode enabled.';
    renderDetails();
  };

  let partySearchDebounce: NodeJS.Timeout | undefined;
  partySearchElement.oninput = () => {
    if (partySearchDebounce !== undefined) {
      clearTimeout(partySearchDebounce);
    }
    partySearchDebounce = setTimeout(() => {
      renderParties();
    }, 80);
  };
  favoriteOnlyToggleElement.onchange = renderParties;

  updateModeButtonState();
  renderParties();
  renderDetails();
  loadCommentsFromServer().catch(() => {
    statusElement.innerText = 'Could not sync notes from data storage.';
  });

  yearElement.onchange = () => setupBitacora(days);
  monthElement.onchange = () => setupBitacora(days);
}

function getDateInfo(dateStr: string) : {
  year: number;
  month: number;
  day: number;
} {
  const dateMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch === null) {
    throw new Error('Incorrect date string: ' + dateStr);
  }

  const [_, ...numbers] = dateMatch;
  const [year, month, day] = numbers.map((n) => Number(n));
  return {
    year,
    month,
    day
  };
}

function getDateElement({ day, year, month, events, selected, inParty }: DateInfo,
  left: DateInfo | undefined,
  right: DateInfo | undefined,
  top: DateInfo | undefined,
  bottom: DateInfo | undefined  
): string {
  const elements: boolean[] = [];
  for (let index = 0; index < 3; index++) {
    elements.push(true);
  }
  if (day === 0) {
    return `<td class="undefined-day"></td>`
  }

  let classes: string[] = [];
  if (left === undefined || left.year === 0 || left.year === 0) {
    classes.push('left-edge');
  }
  if (right === undefined || right.year === 0 || (right.month > month || right.year > year)) {
    classes.push('right-edge');
  }
  if (bottom === undefined || (bottom.month > month || bottom.year > year) || bottom.year === 0) {
    classes.push('bottom-edge');
  }
  if (top === undefined || top.month < month || top.year === 0) {
    classes.push('top-edge');
  }

  if (events.length === 0) {
    classes.push('non-day');
  } else if (selected) {
    classes.push('selected-day');
  } else {
    classes.push('yes-day');
  }

  if (inParty) {
    classes.push('party-day');
  } else {
    classes.push('non-party-day');
  }

  const sideIcons = new Set<string>();

  for (const event of events) {
    sideIcons.add(event.image);
  }

  let iconsArray: string[] = [];
  // preventing overflowing
  if (sideIcons.size <= 4) {
    iconsArray = Array.from(sideIcons.values());
  } else {
    iconsArray = Array.from(sideIcons.values()).filter((element) => element !== 'other').slice(0, 3);
    iconsArray.push('other');
  }

  const imageElements = iconsArray.map((imageName) => `
    <div class="image-container">
      <img src="${imageName}.png" class="day-icon" />
    </div>`);

  while (imageElements.length < 4) {
    imageElements.push('<div></div>');
  }

  // data date will be important to be able to fetch what element is clicked
  return `
  <td class="${classes.join(' ')}" data-date="${getDateFormat({ year, month, day })}">
  <div class="${events.length === 0 ? '' : 'clickable'}">${day}</div>
    <div class="icons-container">
      ${imageElements.join('')}
    </div>
  </td>
  `;
}

function getFirstDayOfWeek(week: DateInfo[]): DateInfo {
  let firstDay: DateInfo = week[0];
  for (const day of week) {
    if (day.year > 0) {
      firstDay = day;
      break;
    }
  }

  return firstDay;
}

function getMonthClassName(month: number, year: number) {
  return `month-${year}${String(month).padStart(2, '0')}`;
}

function getWeekElement(days: DateInfo[], rowsSpan: number, previousWeek: DateInfo[] | undefined, nextWeek: DateInfo[] | undefined): string {
  const firstDay = getFirstDayOfWeek(days);

  return `
<tr>
  ${rowsSpan === 0 ? '' : (
    // month and year to identify region
    `
    <td rowspan="${rowsSpan}" class="month-name ${getMonthClassName(firstDay.month, firstDay.year)}" data-month="${firstDay.month}" data-year="${firstDay.year}">
      ${MONTHS[firstDay.month - 1].slice(0, 3)}'${String(firstDay.year).slice(2)}
    </td>
    `
  )}
  ${days.map((day, i) => {
    const left = days[i - 1];
    const right = days[i + 1];
    const top = previousWeek === undefined ? undefined : previousWeek[i];
    const bottom = nextWeek === undefined ? undefined : nextWeek[i];
    return getDateElement(day, left, right, top, bottom);
  }).join('')}
</tr>
  `
}

function getDateFormat({ year, month, day}: { year: number; month: number; day: number; }): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getDateFromDateInfo({ day, month, year}: DateInfo): Date {
  return new Date(year, month - 1, day);
}

enum CalendarScrollAction {
  ScrollToSelectedDay,
  NoScroll,
  ScrollToMonth
};

/** Render the calendar as the timeline */
function createCalendar(
  days: DateInfo[],
  scroll: CalendarScrollAction = CalendarScrollAction.ScrollToSelectedDay,
  dayTitle: string | undefined = undefined,
  dayDescription: string | undefined = undefined
) {

  /** Will be used to track which days have events */
  const dateMap: Record<string, DateInfo> = {};
  days.forEach((day) => {
    dateMap[getDateFormat(day)] = day;
  })

  // days only has all days with events, we need
  // to also have every day in between those
  const daysToUse: DateInfo[] = [];

  const endDate = new Date(2013, 0, 1);
  // iterating through every day between start and end

  let partyCount = 0;
  for (let date = getDateFromDateInfo(days[0]); date < endDate; date.setDate(date.getDate() + 1)) {
    const dateInfoOfDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      events: [] as Event[],
      inParty: partyCount > 0
    };
    
    const dateStr = getDateFormat(dateInfoOfDate);
    const day = dateMap[dateStr];
    if (day === undefined) {
      daysToUse.push(dateInfoOfDate);
    } else {
      let dayDateInfo = day;
      dayDateInfo.events.forEach(e => {
        if (e.party === 'start') {
          partyCount++;
        } else if (e.party === 'end') {
          partyCount--;
        }
      });
      dayDateInfo = { ...dayDateInfo, inParty: partyCount > 0 };
      if (dateStr === currentVersion) {
        dayDateInfo = { ...dayDateInfo, selected: true };
      }
      daysToUse.push(dayDateInfo);
    }
  }

  // padding with "dead" dates at the start
  const firstDayOfWeek = getDateFromDateInfo(days[0]).getDay();

  for (let i = 0; i < firstDayOfWeek; i++) {
    daysToUse.unshift({ day: 0, year: 0, month: 0, events: [], inParty: false });
  }

  const weeks: DateInfo[][] = [];
  let curWeek: DateInfo[] = [];
  for (let i = 0; i < daysToUse.length; i++) {
    curWeek.push(daysToUse[i]);
    
    const weekDay = i % 7;
    if (weekDay === 6) {
      weeks.push(curWeek);
      curWeek = [];
    }
  }

  // padding with "dead" dates at the end
  while (curWeek.length < 7) {
    curWeek.push({ year: 0, month: 0, day: 0, events: [], inParty: false });
  }
  weeks.push(curWeek);

  // constructing a version in which each week has also how many rows it will span
  const weeksWithSpanInfo: Array<{ week: DateInfo[]; span: number; }> = [];
  let currentSpan = -1;
  let currentMonth = -1;
  let weekSpanStart = -1;
  weeks.forEach((week, i) => {
    const weeksMonth = getFirstDayOfWeek(week).month;
    if (weeksMonth !== currentMonth) {
      // -1 would be the very first, so no need to update spans
      if (currentMonth > 0) {
        weeksWithSpanInfo[weekSpanStart].span = currentSpan;
      }

      currentMonth = weeksMonth;
      weekSpanStart = i;
      currentSpan = 1;
    } else {
      currentSpan++;
    }
    weeksWithSpanInfo.push({ week, span: 0 });
  });

  // doing for the very last week
  weeksWithSpanInfo[weekSpanStart].span = currentSpan;

  const DAY_TITLE_ID = 'calendar-title';
  const DAY_DESCRIPTION_ID = 'day-details';
  const NON_DAY_DESCRIPTION = 'Hover over a non grayed-out day to see its details';

  timelineElement.innerHTML = `
<div class="calendar-container">
  <table>
  <thead>
      <th></th>
      <th>
        Sun
      </th>
      <th>
        Mon
      </th>
      <th>
        Tue
      </th>
      <th>
        Wed
      </th>
      <th>
        Thu
      </th>
      <th>
        Fri
      </th>
      <th>
        Sat
      </th>
    </thead>
  <tbody>
    ${weeksWithSpanInfo.map((week, i) => {
      return getWeekElement(
        week.week,
        week.span,
        weeksWithSpanInfo[i - 1]?.week,
        weeksWithSpanInfo[i + 1]?.week)
        ;
      }).join('')}
  </tbody>
  </table>
  <!-- there needs to be a container for it to stick -->
  <div class="calendar-description-container">
    <div class="calendar-description">
      <div id="${DAY_TITLE_ID}">
        ${dayTitle === undefined ? NON_DAY_DESCRIPTION : dayTitle}
      </div>
      <div id="${DAY_DESCRIPTION_ID}">
        ${dayDescription ?? ''}
      </div>
    </div>
  </div>
</div>
  `;
  const scrollToMonth = (year: number, month: number) => {
    const selected = document.querySelector(`.${getMonthClassName(month, year)}`);
    if (selected !== null) {
      const y = selected.getBoundingClientRect().top - 250 + window.scrollY;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };
  
  // jumping to the right elementt
  if (scroll === CalendarScrollAction.ScrollToSelectedDay) {
    const currentDay = getDateInfo(currentVersion);
    scrollToMonth(currentDay.year, currentDay.month);
  } else if (scroll == CalendarScrollAction.ScrollToMonth) {
    const monthIndex = MONTHS.indexOf(monthElement.value);
    scrollToMonth(Number(yearElement.value), monthIndex + 1);
  }

  // scroll timeout is used to interrupt the function
  // scroll event will be called multiple times which would lead
  // to immense iteration times if not interrupted
  let scrollTimeout: NodeJS.Timeout;

  window.onscroll = () => {
    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {      
      const months = document.querySelectorAll('.month-name');
      for (const month of months) {
        if (month instanceof HTMLElement) {
          // first month that the user can read, could be adjusted slightly
          if (month.getBoundingClientRect().top > 0) {
            const year = month.dataset.year;
            const monthNumber = month.dataset.month;
            if (year !== undefined && month !== undefined)
            {
              setSelectElements(Number(monthNumber), Number (year));
            }
            break;
          }
        }
      }
      
    }, 150); // arbitrary delay that works well
  };

  // clicking on a day in the calendar
  const clickableDays = document.querySelectorAll('.yes-day');
  clickableDays.forEach((element) => {
    if (element instanceof HTMLElement) {
      element.onclick = () => {
        const date = element.dataset.date;
        if (date !== undefined) {
          updateVersion(date);
          createCalendar(days, CalendarScrollAction.NoScroll, dayTitle, dayDescription);
        }
      }
    }
  })

  const updateDayOverview = (title: string, description: string) => {
    const dayTitleElement = document.getElementById(DAY_TITLE_ID)!;
    const dayDescriptionElement = document.getElementById(DAY_DESCRIPTION_ID)!;
    dayTitleElement.innerText = title;
    dayDescriptionElement.innerHTML = description;
    dayTitle = title;
    dayDescription = description;
  }

  const dayElements = document.querySelectorAll('td');
  dayElements.forEach((element) => {
    element.onmouseenter = () => {
      const date = element.dataset.date;
      if (date !== undefined) {
        const dateInfo = dateMap[date];
        if (dateInfo === undefined) {
          updateDayOverview('This day has no registered updates', '');
        } else {
          updateDayOverview(getFullDate(dateInfo), getDescription(dateInfo));
        }
      }
    }
  })

  timelineElement.onmouseleave = () => {
    updateDayOverview(NON_DAY_DESCRIPTION, '');
  }

  yearElement.onchange = () => createCalendar(days, CalendarScrollAction.ScrollToMonth);
  monthElement.onchange = () => createCalendar(days, CalendarScrollAction.ScrollToMonth);

  const as3Footer = document.getElementById('as3-footer')!;
  as3Footer.innerHTML = `
    <button>
      Click here to play in a 2016/2017 version (still in development)
    </button>
  `;

  as3Footer.onclick = (e) => {
    updateVersion('2016-01-01');
  }
}

function updateTimeline(days: DateInfo[], scroll: boolean = true) {
  timelineElement.innerHTML = days.filter((day) => {
    const correctYear = String(day.year) === yearElement.value;
    const month = day.month;
    const monthIndex = MONTHS.indexOf(monthElement.value);
    const correctMonth = monthIndex === -1 || (monthIndex === (month - 1));
    return correctYear && correctMonth;
  }).map((day) => {

    const date = getDateFormat(day);

    const selected = date === currentVersion;

    return `
      <div class="${selected ? 'selected-list-day' : 'unselected-day'} timeline-row" data-date="${date}">
        <div class="center">
          ${selected ? (
            '[SELECTED]'
          ) : (
            '[Click to select]'
          )}
        </div>
        <div class="center">${getFullDate(day)}</div>
        <div class="list-description-container">
          ${getDescription(day)}
        </div>
      </div>
    `
  }).join('')

  const timelineRows = document.querySelectorAll('.unselected-day');

  if (scroll) {
    const selected = document.querySelectorAll('.selected-day')[0];
  
    // is undefined if picked a range where nothing is selected
    if (selected === undefined) {
      // reset to the top
      window.scrollTo({ top: 0 });
    } else if (selected !== undefined) {
      // need to add some amount so that it doesn't get hidden at the top
      const y = selected.getBoundingClientRect().top - 150 + window.scrollY;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  timelineRows.forEach((row) => {
    row.addEventListener('click', () => {
      if (row instanceof HTMLDivElement) {
        const date = row.dataset.date;
        if (date !== undefined) {
          updateVersion(date);
          updateTimeline(days, false);
        }
      }
    })
  });

  yearElement.onchange = () => updateTimeline(days);
  monthElement.onchange = () => updateTimeline(days);
}

function setSelectedDateText(version: string) {
  document.getElementById('selected-date')!.innerText = getFullDate(getDateInfo(version), true);
}

/** Update the timeline version */
async function updateVersion(version: string) {
  currentVersion = version;
  await post('update', { settings: { version }, reset: true });
  timelineApi.update();
  setSelectedDateText(version);
}

window.addEventListener('get-timeline', (e: any) => {
  const days = e.detail as DateInfo[];
  getSettings().then((settings) => {
    currentVersion = settings.version;
    const dateInfo = getDateInfo(currentVersion);
    setSelectElements(dateInfo.month, dateInfo.year);
    setSelectedDateText(currentVersion);
    const year = currentVersion.slice(0, 4);
    yearElement.value = year;
    createCalendar(days);
  });

  const calendarButton = document.getElementById('calendar-timeline')! as HTMLInputElement;
  const listButton = document.getElementById('list-timeline')! as HTMLInputElement;
  const bitacoraButton = document.getElementById('bitacora-timeline')! as HTMLInputElement;

  calendarButton.addEventListener('change', (e) => {
    if (e.target instanceof HTMLInputElement && e.target.checked) {
      createCalendar(days);
    }
  });

  listButton.addEventListener('change', (e) => {
    if (e.target instanceof HTMLInputElement && e.target.checked) {
      updateTimeline(days);
    }
  });

  bitacoraButton.addEventListener('change', (e) => {
    if (e.target instanceof HTMLInputElement && e.target.checked) {
      setupBitacora(days);
    }
  });
});
