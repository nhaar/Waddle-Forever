/** Module writes the data for all standalone updates related to the seasonal catalogs */

import { DateRefMap } from "./changes";
import { Update } from "./updates";

/** All clothing catalogs that are released Pre-CPIP */
export const PRE_CPIP_CATALOGS: DateRefMap = {
  '2005-09-21': 'archives:September05Style.swf',
  '2005-10-24': 'archives:Clothing_0510.swf',
  '2005-11-01': 'archives:Clothing_0511.swf',
  '2005-12-01': 'archives:Clothing_0512.swf',
  '2006-01-01': 'archives:Clothing_0601.swf',
  '2006-02-03': 'archives:Clothing_0602.swf',
  '2006-03-03': 'archives:Clothing_0603.swf',
  '2006-04-07': 'archives:Clothing_0604.swf',
  '2006-05-05': 'archives:Clothing_0605.swf',
  '2006-06-02': 'archives:Clothing_0606.swf',
  '2006-07-07': 'archives:Clothing_0607.swf',
  '2006-08-04': 'archives:Clothing_0608.swf',
  '2006-09-01': 'archives:September06Style.swf',
  '2006-10-06': 'archives:October06Style.swf',
  '2006-11-03': 'archives:Nov06Style.swf',
  '2006-12-01': 'archives:Dec06Style.swf',
  '2007-01-05': 'archives:Clothing_0701.swf',
  '2007-02-02': 'archives:Clothing_0702.swf',
  '2007-03-02': 'archives:Clothing_0703.swf',
  '2007-04-06': 'archives:Clothing_0704.swf',
  '2007-05-04': 'archives:Clothing_0705.swf',
  '2007-06-01': 'archives:Clothing_0706.swf',
  '2007-07-06': 'archives:Clothing_0707.swf',
  '2007-08-02': 'archives:August2007PenguinStyle.swf',
  '2007-09-07': 'archives:September07Style.swf',
  '2007-10-05': 'archives:PenguinStyleOct2007.swf',
  '2007-11-02': 'archives:PenguinStyleNov2007.swf',
  '2007-12-07': 'archives:Clothing_0712.swf',
  '2008-01-04': 'archives:Clothing_0801.swf',
  '2008-02-01': 'archives:Feb2008.swf',
  '2008-03-07': 'archives:PenguinStyleMar2008.swf',
  '2008-04-04': 'archives:Apr2008.swf',
  '2008-05-02': 'archives:May2008.swf',
  '2008-06-06': 'archives:Jun2008.swf',
};

/** All clothing catalogs available Post-CPIP */
export const CPIP_CATALOGS: DateRefMap = {
  '2008-07-04': 'archives:July08Style.swf',
  '2008-08-01': 'archives:PSAug2008.swf',
  '2008-09-05': 'archives:Sep2008.swf',
  '2008-10-03': 'archives:CatOct2008.swf',
  '2008-11-07': 'archives:CatNov2008.swf',
  '2008-12-05': 'archives:December08Style.swf',
  '2009-01-02': 'archives:January09Style.swf',
  '2009-02-06': 'archives:CatFeb2009.swf',
  '2009-03-06': 'archives:Mar2009.swf',
  '2009-04-03': 'archives:PSApr2009.swf',
  '2009-05-01': 'archives:May2009.swf',
  '2009-08-07': 'archives:August09Style.swf',
  '2009-09-04': 'archives:September09Style.swf',
  '2009-10-02': 'archives:Oct2009.swf',
  '2009-11-06': 'archives:November09Style.swf',
  '2009-12-04': 'archives:December09Style.swf',
  [Update.NEW_YEARS_2010_UPDATE]: 'archives:January10Style.swf',
  '2010-02-05': 'archives:Feb10Clothing.swf',
  '2010-04-01': 'archives:April10Style.swf',
  '2010-05-07': 'archives:May2010.swf',
  '2010-09-03': 'archives:September10Style.swf',
  '2010-10-01': 'archives:PSOct2010.swf',
  '2010-11-05': 'archives:November10Style.swf',
  '2010-12-03': 'archives:PenguinStyleDec2010.swf'
};

/** All furniture catalogs */
export const FURNITURE_CATALOGS: DateRefMap = {
  '2008-06-20': 'archives:Jun-Jul2008Furniture.swf',
  '2008-07-18': 'archives:FurnJul2008.swf',
  '2008-08-29': 'archives:FurnAug2008.swf',
  '2008-09-19': 'archives:FurnSep2008.swf',
  '2008-10-17': 'archives:FurnOct2008.swf',
  '2008-12-12': 'archives:FurnDec2008.swf',
  '2009-01-16': 'archives:FurnJan2009.swf',
  '2009-02-20': 'archives:FurnFeb2009.swf',
  '2009-04-17': 'archives:FurnApr2009.swf',
  '2009-09-18': 'archives:FurnSep2009.swf',
  '2009-10-16': 'archives:OctoberFurn09.swf',
  '2009-11-21': 'archives:NovemberFurn09.swf',
  '2009-12-11': 'archives:December09Furniture.swf',
  '2010-03-12': 'archives:March10Furniture.swf',
  '2010-04-16': 'archives:FurnApr2010.swf',
  '2010-05-14': 'archives:May10Furniture.swf',
  '2010-08-20': 'archives:FurnitureAug10.swf',
  '2010-09-24': 'archives:FurnitureSept10.swf',
  '2010-10-15': 'archives:October10Furniture.swf',
  '2010-11-12': 'archives:FurnNov2010.swf',
  '2010-12-10': 'archives:FurnDec2010.swf'
};

/** All igloo catalogs */
export const IGLOO_CATALOGS: DateRefMap = {
  '2010-04-16': 'archives:April2010Igloo.swf',
  '2010-08-20': 'archives:August10Igloo.swf',
  '2010-11-12': 'archives:November2010Igloo.swf'
};