import { Update } from "./updates";

type StandaloneTemporaryChange = {
  startDate: string;
  endDate: string;
  fileRef: string;
  comment?: string;
  endComment?: string;
  updates?: Array<{
    date: string;
    fileRef: string;
    comment?: string;
  }>
}

export const STANDALONE_TEMPORARY_CHANGE: Record<string, StandaloneTemporaryChange[]> = {
  'play/v2/content/global/rooms/mtn.swf': [
    {
      startDate: Update.MUSIC_JAM_2010_CONST_START,
      endDate: Update.JULY_4_2010_END,
      fileRef: 'archives:2010newyearfireworksskihill.swf' // same as new years day
    }
  ],
  'play/v2/content/global/rooms/berg.swf': [
    {
      // removing fireworks in music jam construction for the iceberg
      startDate: Update.JULY_4_2010_END,
      endDate: Update.MUSIC_JAM_2010_START,
      fileRef: 'recreation:iceberg_mjamconst_no_fireworks.swf'
    }
  ],
  'play/v2/content/global/binoculars/empty.swf': [
    {
      startDate: '2010-10-21',
      endDate: Update.HALLOWEEN_2010_START,
      fileRef: 'archives:Storm_on_horizon.swf',
      comment: 'A storm is approaching and visible from the Cove'
    }
  ],
  'artwork/rooms/plaza.swf': [
    {
      startDate: Update.CHRISTMAS_2006_DECORATION,
      endDate: '2006-12-21',
      fileRef: 'archives:ArtworkRoomsPlaza42.swf',
      comment: 'A tree is available to be decorated for Christmas'
    },
    {
      startDate: '2007-12-14',
      endDate: Update.CHRISTMAS_2007_START,
      fileRef: 'archives:RoomsPlaza-ChristmasParty2007Pre.swf',
      comment: 'The Coins For Change event begins'
    }
  ]
}
