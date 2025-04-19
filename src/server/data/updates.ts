import { StaticDataTable } from "../../common/static-table";
import { Version } from "../routes/versions";

type Update = {
  id: number;
  time: Version;
};

export const UPDATES = new StaticDataTable<Update, ['id', 'time']>(
  ['id', 'time'],
  [
    // Beta release
    [1, '2005-08-22'],
    
    // Added snow forts
    [2, '2005-09-12'],

    // beta test start
    [3, '2005-09-21'],

    // beta test end
    [4, '2005-09-22'],

    // newspapers are added
    [6, '2005-10-24'],

    // halloween 2005 start
    [7, '2005-10-27'],
    // halloween 2005 end
    [8, '2005-11-01'],

    // sport shop open
    [9, '2005-11-03'],

    // Mtn opens
    [10, '2005-11-18'],

    // puffle discovery begins
    [11, '2005-11-15'],
    //puffle discovery end
    [12, '2005-12-05'],

    // puffle roundup release
    [13, '2005-12-14'],

    // christmas party 2005 starts
    [14, '2005-12-22'],
    // christmas party 2005 ends
    [15, '2005-12-26'],
    // ski lodge opened, have a feeling it wasnt when christmas 05 started
    [16, '2005-12-22'],

    // valentine's day start
    [17, '2006-02-14'],
    // valentine day end
    [18, '2006-02-15'],
    // pizza parlor opening start
    [19, '2006-02-24'],
    // pizza parlor opening end
    [20, '2006-02-28'],

    // pet shop opens
    [21, '2006-03-17'],

    // iceberg opens
    [22, '2006-03-29'],

    // april fools 2006 start
    [23, '2006-03-31'],
    // april fools 2006 end
    [24, '2006-04-03'],
    // epf update
    [25, '2010-05-27'],
    // Stamps release
    [26, '2010-07-26'],
    // cpip "engine" cutoff
    [27, '2008-07-01'],
    // update which added an extra mancala board to the book room, date unknown
    [28, '2006-01-01'],

    // whatever the update that introduced the vanilla-media engine would be
    [29, '2016-01-01'],

    // the fair 2010 starts
    [30, '2010-09-03'],
    // the fair 2011 starts
    [31, '2011-09-22'],

    // catalogue jan
    [32, '2010-01-01'],
    // catalogue feb
    [33, '2010-02-05'],
    // catalogue apr
    [34, '2010-04-01'],
    // catalogue may
    [35, '2010-05-07'],
    // catalogue sep
    [36, '2010-09-03'],
    // catalogue oct
    [37, '2010-10-01'],
    // catalogue nov
    [38, '2010-11-05'],
    // catalogue dec
    [39, '2010-12-03'],

    // quest for golden puffle dec 09
    [40, '2009-12-25'],
    // fairy fables jan 10
    [41, '2010-01-08'],
    // secrets of the bamboo forest feb 10
    [42, '2010-02-11'],
    // quest for the golden puffle mar 10
    [43, '2010-03-29'],
    // ruby and the ruby june 10
    [44, '2010-06-10'],
    // underwater adventure july 10
    [45, '2010-07-21'],
    // squidzoid august 10
    [46, '2010-08-26'],
    // fairy fables september 10
    [47, '2010-09-16'],
    // secrets of the bamboo forest oct 10
    [48, '2010-10-08'],
    // space adventure planet Y nov 2010
    [49, '2010-11-18'],
    // ruby and the ruby dec 2010
    [50, '2010-12-28'],

    // new years 2010 party start
    [51, '2010-01-01'],
    // new years 2010 party end
    [52, '2010-01-04'],
    // cave expedition start
    [53, '2010-01-22'],
    // cave expedition end
    [54, '2010-01-29'],
    // puffle party 2010 starts
    [55, '2010-02-18'],
    // puffle party 2010 ends
    [56, '2010-02-25'],
    // puffle party 2010 construction
    [57, '2010-02-11'],
    // ppa 2010 starts
    [58, '2010-03-18'],
    // ppa 2010 ends
    [59, '2010-03-29'],
    // april fools 2010 starts
    [60, '2010-03-31'],
    // april fools 2010 ends
    [61, '2010-04-05'],
    // earth day 2010 starts
    [62, '2010-04-21'],
    // earth day 2010 ends
    [63, '2010-04-27'],
    // earth day 2010 construction starts
    [64, '2010-04-15'],
    // medieval construction 2010 starts
    [65, '2010-04-29'],
    // medieval 2010 starts
    [66, '2010-05-07'],
    // medieval 2010 ends
    [67, '2010-05-16'],
    // popcorn exploison start
    [68, '2010-05-18'],
    // sport shop closes
    [69, '2010-05-25'],
    // island adventure construction 2010
    [70, '2010-06-10'],
    // island adventure 2010 start
    [71, '2010-06-18'],
    // island adventure 2010 end
    [72, '2010-06-28'],
    // music jam 2010 construction start
    [73, '2010-07-01'],
    // 4th of july 2010 end
    [74, '2010-07-05'],
    // music jam 2010 start
    [75, '2010-07-09'],
    // music jam 2010 end
    [76, '2010-07-19'],
    // music jam 2010 instrument update
    [77, '2010-07-15'],
    // mountain expedition start
    [78, '2010-08-12'],
    // mountain expedition end
    [79, '2010-08-19'],
    // mountain expedition const
    [80, '2010-08-05'],
    // fair 2010 const
    [81, '2010-08-26'],
    // fair 2010 start
    [82, '2010-09-03'],
    // fair 2010 end
    [83, '2010-09-13'],
    // new items in the fair 2010
    [84, '2010-09-10']
  ]
);

export const FIRST_UPDATE = 1;
export const CPIP_UPDATE = 27;