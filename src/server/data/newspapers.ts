import { Version } from "../routes/versions";
import { FIRST_AS3_NEWSPAPER, FIRST_BOILER_ROOM_PAPER } from "./updates";

export const FAN_ISSUE_DATE = '2005-10-28'

/** Array that lists all the newspapers that were never in the boiler room (index number + 1 matches the issue number) */
export const PRE_BOILER_ROOM_PAPERS: Version[] = [
  '2005-10-24',
  '2005-11-03',
  '2005-11-08',
  '2005-11-11',
  '2005-11-16',
  '2005-11-21',
  '2005-12-01',
  '2005-12-08',
  '2005-12-15',
  '2005-12-22',
  '2005-12-29',
  '2006-01-05',
  '2006-01-12',
  '2006-01-19',
  '2006-01-26',
  '2006-02-02',
  '2006-02-09',
  '2006-02-16',
  '2006-02-23',
  '2006-03-02',
  '2006-03-09',
  '2006-03-16',
  '2006-03-23',
  '2006-03-30',
  '2006-04-06'
];

export type As2Newspaper = {
  date: Version,
  headline: string,
  fileId?: number;
}

/** Null properties are unarchived */
export type As3Newspaper = {
  date: Version;
  headline: string;
  askFront: number;
  dividersFront: number | null;
  featureStory: number;
  headerFront: number;
  navigationFront: number | null;
  newsFlash: number;
  supportStory: number;
  upcomingEvents: number;
  askBack: number;
  dividersBack: number | null;
  headerBack: number;
  jokes: number;
  navigationBack: number | null;
  submit: number | null;
  tips: number;
  answers: number;
}

export const AS2_NEWSPAPERS: As2Newspaper[] = [
  {
    date: FIRST_BOILER_ROOM_PAPER,
    headline: 'EASTER EGG HUNT!!'
  },
  {
    date: '2006-04-20',
    headline: 'GO GREEN FOR THE SPRING!',
    fileId: 3767
  },
  {
    date: '2006-04-27',
    headline: 'UNDERGROUND CAVES FOUND!!',
    fileId: 3768
  },
  {
    date: '2006-05-04',
    headline: 'CAVE CONSTRUCTION!!',
    fileId: 3769
  },
  {
    date: '2006-05-11',
    headline: 'CAVE EXCLUSIVE',
    fileId: 3770
  },
  {
    date: '2006-05-18',
    headline: 'IGLOO DECORATING SPECIAL',
    fileId: 3771
  },
  {
    date: '2006-05-25',
    headline: 'MINE SHAFTS',
    fileId: 3772
  },
  {
    date: '2006-06-01',
    headline: 'UNDERGROUND OPENING',
    fileId: 3773
  },
  {
    date: '2006-06-08',
    headline: 'SUMMER PARTY!!',
    fileId: 3774
  },
  {
    date: '2006-06-15',
    headline: 'SUMMER PARTY!!',
    fileId: 3775
  },
  {
    date: '2006-06-22',
    headline: 'SUMMER PARTY CONTINUES!!',
    fileId: 3776
  },
  {
    date: '2006-06-29',
    headline: 'WESTERN THEME',
    fileId: 3777
  },
  {
    date: '2006-07-06',
    headline: 'WADDLE IN THE WEST',
    fileId: 4571
  },
  {
    date: '2006-07-13',
    headline: 'BAND REUNION',
    fileId: 4572
  },
  {
    date: '2006-07-20',
    headline: 'FIND THE MISSING INSTRUMENTS',
    fileId: 4573
  },
  {
    date: '2006-07-27',
    headline: 'HISTORY OF MANCALA',
    fileId: 4574
  },
  {
    date: '2006-08-03',
    headline: 'LET THE GAMES BEGIN!!',
    fileId: 4575
  },
  {
    date: '2006-08-10',
    headline: 'SECRET AGENT MAKES TOWN SAFE',
    fileId: 4576
  },
  {
    date: '2006-08-17',
    headline: 'NEW FITNESS EQUIPMENT',
    fileId: 4577
  },
  {
    date: '2006-08-24',
    headline: 'PURPLE PUFFLES FOR ADOPTION',
    fileId: 4578
  },
  {
    date: '2006-08-31',
    headline: 'LIGHTHOUSE UNDER THE SPOTLIGHT',
    fileId: 4579
  },
  {
    date: '2006-09-07',
    headline: 'SAVE THE LIGHTHOUSE!!',
    fileId: 4580
  },
  {
    date: '2006-09-14',
    headline: 'LIVING IN STYLE',
    fileId: 4581
  },
  {
    date: '2006-09-21',
    headline: 'LIGHT UP THE HOUSE',
    fileId: 4752
  },
    {
    date: '2006-09-28',
    headline: 'WALKING PUFFLES!',
    fileId: 4582
  },
  {
    date: '2006-10-05',
    headline: 'HALLOWEEN HULLABALOO',
    fileId: 4583
  },
  {
    date: '2006-10-12',
    headline: 'SHIP ASHORE',
    fileId: 4584
  },
  {
    date: '2006-10-19',
    headline: 'HAUNTED IGLOO DECOR',
    fileId: 4585
  },
  {
    date: '2006-10-26',
    headline: 'CRASH LANDING',
    fileId: 4586
  },
  {
    date: '2006-11-02',
    headline: 'PENGUINS TAKE FLIGHT',
    fileId: 4587
  },
  {
    date: '2006-11-09',
    headline: 'A COLORFUL MISTAKE',
    fileId: 4588
  },
  {
    date: '2006-11-16',
    headline: 'MAKING WAVES',
    fileId: 4589
  },
  {
    date: '2006-11-23',
    headline: 'GRIN FOR GREEN',
    fileId: 4590
  },
  {
    date: '2006-11-30',
    headline: 'ROCKHOPPER\'S SHIP SPOTTED',
    fileId: 4591
  },
  {
    date: '2006-12-07',
    headline: 'ROCKHOPPER LANDS TOMORROW',
    fileId: 4592
  },
  {
    date: '2006-12-14',
    headline: 'IGLOO DECORATING CONTEST',
    fileId: 4593
  },
  {
    date: '2006-12-21',
    headline: 'A VERY WHITE CHRISTMAS',
    fileId: 4594
  },
  {
    date: '2006-12-28',
    headline: 'HAPPY NEW YEAR!',
    fileId: 4595
  },
  {
    date: '2007-01-04',
    headline: 'WINTER FIESTA!',
    fileId: 4596
  },
  {
    date: '2007-01-11',
    headline: 'TOUR GUIDES TO ARRIVE',
    fileId: 4597
  },
  {
    date: '2007-01-18',
    headline: 'GET FLOORED!',
    fileId: 4598
  },
  {
    date: '2007-01-25',
    headline: 'TOUR GUIDES NEEDED',
    fileId: 4599
  },
  {
    date: '2007-02-01',
    headline: 'FESTIVAL OF SNOW',
    fileId: 4600
  },
  {
    date: '2007-02-08',
    headline: 'WINNERS ANNOUNCED',
    fileId: 4601
  },
  {
    date: '2007-02-15',
    headline: 'GARY THE GADGET GUY',
    fileId: 4602
  },
  {
    date: '2007-02-22',
    headline: 'PIZZATRON 3000',
    fileId: 4603
  },
  {
    date: '2007-03-01',
    headline: 'MESSAGE IN A BOTTLE',
    fileId: 4604
  },
  {
    date: '2007-03-08',
    headline: 'ST. PATRICK\'S DAY 07',
    fileId: 4605
  },
  {
    date: '2007-03-15',
    headline: 'CHARMED CELEBRATIONS',
    fileId: 4606
  },
  {
    date: '2007-03-22',
    headline: 'PUMPED UP PUFFLE PLAY',
    fileId: 4607
  },
  {
    date: '2007-03-29',
    headline: 'APRIL FOOL\'S DAY',
    fileId: 4608
  },
  {
    date: '2007-04-05',
    headline: 'EASTER EGG HUNT',
    fileId: 4609
  },
  {
    date: '2007-04-12',
    headline: 'STAGED FUN',
    fileId: 4610
  },
  {
    date: '2007-04-19',
    headline: 'PIRATE PARTY PARADISE',
    fileId: 4611
  },
  {
    date: '2007-04-26',
    headline: 'PARTY ON (DECK)!',
    fileId: 4612
  },
  {
    date: '2007-05-03',
    headline: 'SHIPSHAPE SURPRISE',
    fileId: 4613
  },
  {
    date: '2007-05-10',
    headline: 'LOCATION LOST',
    fileId: 4614
  },
  {
    date: '2007-05-17',
    headline: 'THE MAP QUEST',
    fileId: 4615
  },
  {
    date: '2007-05-24',
    headline: 'PATH TO THE COVE',
    fileId: 4616
  },
  {
    date: '2007-05-31',
    headline: 'CURIOUS CONSTRUCTION EXPLAINED',
    fileId: 4617
  },
  {
    date: '2007-06-07',
    headline: 'BIG SUMMER BASH',
    fileId: 4618
  },
  {
    date: '2007-06-14',
    headline: 'SUMMER PARTY CONTINUES',
    fileId: 4619
  },
  {
    date: '2007-06-21',
    headline: 'PIRATE PUFFLE ON BOARD',
    fileId: 4620
  },
  {
    date: '2007-06-28',
    headline: 'FAR OUT SURFING',
    fileId: 4621
  },
  {
    date: '2007-07-05',
    headline: 'WATER PARTY',
    fileId: 4622
  },
  {
    date: '2007-07-12',
    headline: 'UNDERGROUND CLOSED',
    fileId: 4623
  },
  {
    date: '2007-07-19',
    headline: 'WATER PARTY EXTENDED',
    fileId: 4624
  },
  {
    date: '2007-07-26',
    headline: 'WATER PARTY A BIG SPLASH',
    fileId: 4625
  },
  {
    date: '2007-08-02',
    headline: 'WINNERS ANNOUNCED',
    fileId: 4626
  },
  {
    date: '2007-08-09',
    headline: 'OUTFIT CONTEST WINNERS ANNOUNCED',
    fileId: 4627
  },
  {
    date: '2007-08-16',
    headline: 'CAMP PENGUIN',
    fileId: 4628
  },
  {
    date: '2007-08-23',
    headline: 'CAMP PENGUIN!',
    fileId: 4629
  },
  {
    date: '2007-08-30',
    headline: 'SPORT SHOP UPDATE',
    fileId: 4630
  },
  {
    date: '2007-09-06',
    headline: 'CARGO CONTENTS DISCOVERED!',
    fileId: 4631
  },
  {
    date: '2007-09-13',
    headline: 'FALL FAIR APPROACHING',
    fileId: 4632
  },
  {
    date: '2007-09-20',
    headline: 'FALL FAIR STARTS FRIDAY!',
    fileId: 4633
  },
  {
    date: '2007-09-27',
    headline: 'FALL FAIR FUN!',
    fileId: 4634
  },
  {
    date: '2007-10-04',
    headline: 'COSTUME CONTEST!!!',
    fileId: 4635
  },
  {
    date: '2007-10-11',
    headline: 'HEADS UP!',
    fileId: 4636
  },
  {
    date: '2007-10-18',
    headline: 'STARLIGHT? DARKNIGHT?',
    fileId: 4637
  },
  {
    date: '2007-10-25',
    headline: 'HALLOWEEN PARTY',
    fileId: 4638
  },
  {
    date: '2007-11-01',
    headline: 'WIGGIN\' OUT!',
    fileId: 4639
  },
  {
    date: '2007-11-08',
    headline: 'SURPRISE PARTY!',
    fileId: 4640
  },
  {
    date: '2007-11-15',
    headline: 'GRAND OPENING',
    fileId: 4641
  },
  {
    date: '2007-11-22',
    headline: 'YELLOW PUFFLES DISCOVERED!',
    fileId: 4642
  },
  {
    date: '2007-11-29',
    headline: 'GOOD HOMES FOR YELLOW PUFFLES',
    fileId: 4643
  },
  {
    date: '2007-12-06',
    headline: 'COINS FOR CHANGE',
    fileId: 4644
  },
  {
    date: '2007-12-13',
    headline: 'COINS FOR CHANGE',
    fileId: 4645
  },
  {
    date: '2007-12-20',
    headline: 'CONTEST WINNERS ANNOUNCED',
    fileId: 4646
  },
  {
    date: '2007-12-25',
    headline: 'DONATION ANNOUNCEMENT',
    fileId: 4647
  },
  {
    date: '2008-01-03',
    headline: 'HAPPY NEW YEAR!',
    fileId: 4648
  },
  {
    date: '2008-01-10',
    headline: 'NEW PLAY AT THE STAGE',
    fileId: 4649
  },
  {
    date: '2008-01-17',
    headline: 'MIGRATOR CRASHES!',
    fileId: 4650
  },
  {
    date: '2008-01-24',
    headline: 'ROCKHOPPER IS OKAY',
    fileId: 4651
  },
  {
    date: '2008-01-31',
    headline: 'RALLY FOR ROCKHOPPER',
    fileId: 4652
  },
  {
    date: '2008-02-07',
    headline: 'SAVE THE MIGRATOR',
    fileId: 4653
  },
  {
    date: '2008-02-14',
    headline: 'SEA SALVAGING SUB TO SAVE SHIP',
    fileId: 4654
  },
  {
    date: '2008-02-21',
    headline: 'SAVE THE MIGRATOR',
    fileId: 4655
  },
  {
    date: '2008-02-28',
    headline: 'RECONSTRUCTION TO BEGIN SOON',
    fileId: 4656
  },
  {
    date: '2008-03-06',
    headline: 'ST. PATRICK\'S DAY PARTY!',
    fileId: 4657
  },
  {
    date: '2008-03-13',
    headline: 'SALVAGED SHIP SLOWLY SURFACING',
    fileId: 4658
  },
  {
    date: '2008-03-20',
    headline: 'FRONT-END FINALLY FISHED',
    fileId: 4659
  },
  {
    date: '2008-03-27',
    headline: 'APRIL FOOLS!!!',
    fileId: 4660
  },
  {
    date: '2008-04-03',
    headline: 'AUNT ARCTIC ASKED TO BE EDITOR',
    fileId: 4661
  },
  {
    date: '2008-04-10',
    headline: 'READY REPORTERS READILY REQUESTED',
    fileId: 4662
  },
  {
    date: '2008-04-17',
    headline: 'MIGRATOR MENDED - A PROJECT REVIEW',
    fileId: 4663
  },
  {
    date: '2008-04-24',
    headline: 'ROCKHOPPER\'S GRAND RETURN',
    fileId: 4664
  },
  {
    date: '2008-05-01',
    headline: 'BOAT SWEET BOAT',
    fileId: 4665
  },
  {
    date: '2008-05-08',
    headline: 'PARTY PLANNERS PLAN SHINDIG!',
    fileId: 4666
  },
  {
    date: '2008-05-15',
    headline: 'THE ADVENTURE BEGINS',
    fileId: 4667
  },
  {
    date: '2008-05-22',
    headline: 'YE OLDE IGLOO CONTEST',
    fileId: 4668
  },
  {
    date: '2008-05-29',
    headline: 'A NOVEL IDEA',
    fileId: 4669
  },
  {
    date: '2008-06-05',
    headline: 'SUMMER KICK OFF PARTY',
    fileId: 4670
  },
  {
    date: '2008-06-12',
    headline: 'WATER PARTY STARTS JUNE 13',
    fileId: 4671
  },
  {
    date: '2008-06-19',
    headline: 'WATER PARTY! REVIEW',
    fileId: 4672
  },
  {
    date: '2008-06-26',
    headline: 'TREMORS SHAKE UP THE TOWN CENTER',
    fileId: 4673
  },
  {
    date: '2008-07-03',
    headline: 'CAPTAIN COMES BACK!',
    fileId: 4674
  },
  {
    date: '2008-07-10',
    headline: 'SEE THE PENGUIN BAND JULY 25',
    fileId: 4675
  },
  {
    date: '2008-07-17',
    headline: 'SUPERHEROES RETURN!',
    fileId: 4676
  },
  {
    date: '2008-07-24',
    headline: 'IT\'S TIME TO ROCK!',
    fileId: 4677
  },
  {
    date: '2008-07-31',
    headline: 'HARD-CORE ENCORE!',
    fileId: 4678
  },
  {
    date: '2008-08-07',
    headline: 'MUSIC JAM REVIEW',
    fileId: 4679
  },
  {
    date: '2008-08-14',
    headline: 'PREPARING FOR THE PENGUIN GAMES',
    fileId: 4680
  },
  {
    date: '2008-08-21',
    headline: 'WELCOME TO THE PENGUIN GAMES',
    fileId: 4681
  },
  {
    date: '2008-08-28',
    headline: 'PENGUIN GAMES CLOSING CEREMONIES',
    fileId: 4682
  },
  {
    date: '2008-09-04',
    headline: 'CONSTRUCTION AT THE STAGE',
    fileId: 4683
  },
  {
    date: '2008-09-11',
    headline: 'NEW PLAY IS A MYSTERY',
    fileId: 4684
  },
  {
    date: '2008-09-18',
    headline: 'FALL FAIR PARTY!',
    fileId: 4685
  },
  {
    date: '2008-09-25',
    headline: 'FALL FAIR FESTIVITIES!',
    fileId: 4686
  },
  {
    date: '2008-10-02',
    headline: 'FALL FAIR FINISHING WITH FLAIR',
    fileId: 4687
  },
  {
    date: '2008-10-09',
    headline: 'HALLOWEEN PARTY',
    fileId: 4688
  },
  {
    date: '2008-10-16',
    headline: '3 YEAR ANNIVERSARY APPROACHES',
    fileId: 4689
  },
  {
    date: '2008-10-23',
    headline: 'ROCKHOPPER\'S READY FOR THE PARTY',
    fileId: 4690
  },
  {
    date: '2008-10-30',
    headline: 'HALLOWEEN IS HERE',
    fileId: 4691
  },
  {
    date: '2008-11-06',
    headline: 'A SHOCKING SURPRISE',
    fileId: 4692
  },
  {
    date: '2008-11-13',
    headline: 'DOJO GRAND RE-OPENING',
    fileId: 4693
  },
  {
    date: '2008-11-20',
    headline: 'NINJA TRAINING AT THE DOJO',
    fileId: 4694
  },
  {
    date: '2008-11-27',
    headline: 'THE SENSEI SPEAKS',
    fileId: 4695
  },
  {
    date: '2008-12-04',
    headline: 'THE CAPTAIN & COINS FOR CHANGE',
    fileId: 4696
  },
  {
    date: '2008-12-11',
    headline: 'CHRISTMAS WITH THE CAPTAIN',
    fileId: 4697
  },
  {
    date: '2008-12-18',
    headline: 'CHRISTMAS PARTY',
    fileId: 4698
  },
  {
    date: '2008-12-25',
    headline: 'MERRY CHRISTMAS CLUB PENGUIN!',
    fileId: 4699
  },
  {
    date: '2009-01-01',
    headline: 'DANCE FASHIONS AT THE GIFT SHOP!',
    fileId: 4700
  },
  {
    date: '2009-01-08',
    headline: 'DANCE-A-THON - A MEMBER EVENT',
    fileId: 4701
  },
  {
    date: '2009-01-15',
    headline: 'DANCE-A-THON FOR MEMBERS',
    fileId: 4702
  },
  {
    date: '2009-01-22',
    headline: 'FIESTA! PARTY',
    fileId: 4703
  },
  {
    date: '2009-01-29',
    headline: 'MUST-PLAY MULTIPLAYER GAMES',
    fileId: 4704
  },
  {
    date: '2009-02-05',
    headline: 'PUFFLES PLAY WITH THEIR FURNITURE',
    fileId: 4705
  },
  {
    date: '2009-02-12',
    headline: 'PUFFLE PARTY!',
    fileId: 4706
  },
  {
    date: '2009-02-19',
    headline: 'PUFFLE PARTY',
    fileId: 4707
  },
  {
    date: '2009-02-26',
    headline: 'ROCKHOPPER RETURNS ON FEBRUARY 27!',
    fileId: 4708
  },
  {
    date: '2009-03-05',
    headline: 'PRESENTING THE PENGUIN PLAY AWARDS',
    fileId: 4709
  },
  {
    date: '2009-03-12',
    headline: 'ST. PATRICK\'S PARTY 09',
    fileId: 4710
  },
  {
    date: '2009-03-19',
    headline: 'PENGUIN PLAY AWARDS',
    fileId: 4711
  },
  {
    date: '2009-03-26',
    headline: 'PENGUIN PLAY AWARDS CONTINUE!',
    fileId: 4712
  },
  {
    date: '2009-04-02',
    headline: 'APRIL FOOLS PARTY',
    fileId: 4713
  },
  {
    date: '2009-04-09',
    headline: 'PRESENTING THE TOP PLAYS!',
    fileId: 4714
  },
  {
    date: '2009-04-16',
    headline: 'SLEDDING NEWS!',
    fileId: 4715
  },
  {
    date: '2009-04-23',
    headline: 'A MEDIEVAL STORY...',
    fileId: 4716
  },
  {
    date: '2009-04-30',
    headline: 'A MEDIEVAL STORY PART 2...',
    fileId: 4717
  },
  {
    date: '2009-05-07',
    headline: 'MEDIEVAL PARTY',
    fileId: 4718
  },
  {
    date: '2009-05-14',
    headline: 'MEDIEVAL PARTY CONTINUES',
    fileId: 4719
  },
  {
    date: '2009-05-21',
    headline: 'ROCKHOPPER ARRIVES MAY 22',
    fileId: 4720
  },
  {
    date: '2009-05-28',
    headline: 'ROCKHOPPER\'S HERE!',
    fileId: 4721
  },
  {
    date: '2009-06-04',
    headline: 'FORECAST CALLS FOR...PARTY!',
    fileId: 4722
  },
  {
    date: '2009-06-11',
    headline: 'DISCOVER THE ADVENTURE PARTY',
    fileId: 4723
  },
  {
    date: '2009-06-18',
    headline: '101 DAYS OF FUN',
    fileId: 4724
  },
  {
    date: '2009-06-25',
    headline: 'NEW MUSIC FOR DJ3K',
    fileId: 4725
  },
  {
    date: '2009-07-02',
    headline: 'MUSIC JAM 09 IS AMPING UP',
    fileId: 4726
  },
  {
    date: '2009-07-09',
    headline: 'GETTING READY TO ROCK',
    fileId: 4727
  },
  {
    date: '2009-07-16',
    headline: 'MUSIC JAM 09 BEGINS JULY 17',
    fileId: 4728
  },
  {
    date: '2009-07-23',
    headline: 'MUSIC JAM 09 ENDS JULY 26!',
    fileId: 4729
  },
  {
    date: '2009-07-30',
    headline: 'LAST CHANCE FOR PENGUIN TALES',
    fileId: 4730
  },
  {
    date: '2009-08-06',
    headline: 'NEW COLOR IS IN!',
    fileId: 4731
  },
  {
    date: '2009-08-13',
    headline: 'FESTIVAL OF FLIGHT',
    fileId: 4732
  },
  {
    date: '2009-08-20',
    headline: 'FESTIVAL OF FLIGHT FINISHED!',
    fileId: 4733
  },
  {
    date: '2009-08-27',
    headline: 'FUN AT THE FAIR!',
    fileId: 4734
  },
  {
    date: '2009-09-03',
    headline: 'THE FAIR - JOIN IN THE FUN',
    fileId: 4735
  },
  {
    date: '2009-09-10',
    headline: 'PENGUINS THAT TIME FORGOT',
    fileId: 4736
  },
  {
    date: '2009-09-17',
    headline: 'SENSEI STARTS SCAVENGER HUNT',
    fileId: 4737
  },
  {
    date: '2009-09-24',
    headline: 'NINJAS AWAKEN VOLCANO',
    fileId: 4738
  },
  {
    date: '2009-10-01',
    headline: 'HALLOWEEN COSTUMES! OCTOBER 2',
    fileId: 4739
  },
  {
    date: '2009-10-08',
    headline: 'HALLOWEEN IGLOO CONTEST OCTOBER 16',
    fileId: 4740
  },
  {
    date: '2009-10-15',
    headline: 'HALLOWEEN IGLOO CONTEST',
    fileId: 4741
  },
  {
    date: '2009-10-22',
    headline: 'HAPPY 4TH ANNIVERSARY! OCTOBER 24',
    fileId: 4742
  },
  {
    date: '2009-10-29',
    headline: 'HALLOWEEN PARTY',
    fileId: 4743
  },
  {
    date: '2009-11-05',
    headline: 'VOLCANO TAMED - NINJAS NEEDED',
    fileId: 4744
  },
  {
    date: '2009-11-12',
    headline: 'VOLCANO CONSTRUCTION ANNOUNCED',
    fileId: 4745
  },
  {
    date: '2009-11-19',
    headline: 'CARD-JITSU FIRE',
    fileId: 4746
  },
  {
    date: '2009-11-26',
    headline: 'CARD-JITSU FIRE REVEALED',
    fileId: 4747
  },
  {
    date: '2009-12-03',
    headline: 'COINS FOR CHANGE',
    fileId: 4748
  },
  {
    date: '2009-12-10',
    headline: 'MAKE A DIFFERENCE!',
    fileId: 4749
  },
  {
    date: '2009-12-17',
    headline: 'HOLIDAY PARTY',
    fileId: 4750
  },
  {
    date: '2009-12-31',
    headline: 'HAPPY NEW YEAR CLUB PENGUIN!',
    fileId: 3742
  },
  {
    date: '2010-01-07',
    headline: 'CREATE YOUR OWN T-SHIRT',
    fileId: 3743
  },
  {
    date: '2010-01-14',
    headline: 'ROCKSLIDE AT THE MINE!',
    fileId: 3744
  },
  {
    date: '2010-01-21',
    headline: 'SECRET CAVE DISCOVERED!',
    fileId: 3745
  },
  {
    date: '2010-01-28',
    headline: 'CAVES CLOSING UNTIL FURTHER NOTICE',
    fileId: 3746
  },
  {
    date: '2010-02-04',
    headline: 'PUFFLE PARTY',
    fileId: 3747
  },
  {
    date: '2010-02-11',
    headline: 'SECRETS OF THE BAMBOO FOREST',
    fileId: 3748
  },
  {
    date: '2010-02-18',
    headline: 'PUFFLE PARTY',
    fileId: 3749
  },
  {
    date: '2010-02-25',
    headline: 'ORANGE PUFFLES READY TO ADOPT!',
    fileId: 3750
  },
  {
    date: '2010-03-04',
    headline: 'WHERE\'S YARR?',
    fileId: 3751
  },
  {
    date: '2010-03-11',
    headline: 'PUFFLES TRAPPED UNDERGROUND!',
    fileId: 3752
  },
  {
    date: '2010-03-18',
    headline: 'PUFFLE RESCUE',
    fileId: 3753
  },
  {
    date: '2010-03-25',
    headline: 'PENGUIN PLAY AWARDS',
    fileId: 3754
  },
  {
    date: '2010-04-01',
    headline: 'HAPPY APRIL FOOLS!',
    fileId: 3755
  },
  {
    date: '2010-04-08',
    headline: 'EARTH DAY IS COMING!',
    fileId: 3756
  },
  {
    date: '2010-04-15',
    headline: 'CELEBRATE EARTH DAY!'
  },
  {
    date: '2010-04-22',
    headline: 'EARTH DAY CELEBRATIONS BEGIN!'
  },
  {
    date: '2010-04-29',
    headline: 'YE PENGUIN STYLE'
  },
  {
    date: '2010-05-06',
    headline: 'MEDIEVAL PARTY'
  },
  {
    date: '2010-05-13',
    headline: 'YOUR IGLOO-MEDIEVAL STYLE'
  },
  {
    date: '2010-05-20',
    headline: 'POPCORN EVERYWHERE AT SPORT SHOP'
  },
  {
    date: '2010-05-27',
    headline: 'SKI VILLAGE UNDER CONSTRUCTION'
  },
  {
    date: '2010-06-03',
    headline: 'PENGUINS SEEKING ADVENTURE'
  },
  {
    date: '2010-06-10',
    headline: 'ISLAND ADVENTURE PLANS REVEALED'
  },
  {
    date: '2010-06-17',
    headline: 'THE ADVENTURE BEGINS!'
  },
  {
    date: '2010-06-24',
    headline: 'CONTINUE YOUR ADVENTURE!'
  },
  {
    date: '2010-07-01',
    headline: 'GET READY FOR MUSIC JAM 2010'
  },
  {
    date: '2010-07-08',
    headline: 'MUSIC JAM!'
  },
  {
    date: '2010-07-15',
    headline: 'KEEP JAMMIN\''
  },
  {
    date: '2010-07-22',
    headline: 'STAMPS ARRIVE JULY 27'
  },
  {
    date: '2010-07-29',
    headline: 'STAMPS - CAN YOU EARN THEM ALL?'
  },
  {
    date: '2010-08-05',
    headline: 'STAMP BOOK STYLE'
  },
  {
    date: '2010-08-12',
    headline: 'MOUNTAIN EXPEDITION BEGINS'
  },
  {
    date: '2010-08-19',
    headline: 'DESIGN YOUR OWN FURNITURE'
  },
  {
    date: '2010-08-26',
    headline: 'PREPARE FOR THE FAIR'
  },
  {
    date: '2010-09-02',
    headline: 'THE FAIR - BE THERE'
  },
  {
    date: '2010-09-09',
    headline: 'NEW ITEMS AT PRIZE BOOTH'
  },
  {
    date: '2010-09-16',
    headline: 'SHOWDOWN AT THE STADIUM'
  },
  {
    date: '2010-09-23',
    headline: 'GAME ON AT THE STADIUM'
  },
  {
    date: '2010-09-30',
    headline: 'NEW SPOOKY COSTUMES COMING!'
  },
  {
    date: '2010-10-07',
    headline: 'HALLOWEEN IGLOO CONTEST'
  },
  {
    date: '2010-10-14',
    headline: 'HALLOWEEN IGLOO CONTEST'
  },
  {
    date: '2010-10-21',
    headline: 'ANNIVERSARY PARTY OCTOBER 24'
  },
  {
    date: '2010-10-28',
    headline: 'THE HALLOWEEN PARTY IS HERE'
  },
  {
    date: '2010-11-04',
    headline: 'NEW OUTDOOR OUTFITS'
  },
  {
    date: '2010-11-11',
    headline: 'FIRST RAINSTORM ON RECORD'
  }
]

export const AS3_NEWSPAPERS: As3Newspaper[] = [
  {
    date: FIRST_AS3_NEWSPAPER,
    headline: 'READY FOR CARD-JITSU WATER?',
    askBack: 4756,
    askFront: 4757,
    featureStory: 4758,
    headerBack: 4759,
    headerFront: 4760,
    jokes: 4761,
    newsFlash: 4762,
    answers: 4763,
    supportStory: 4764,
    tips: 4765,
    upcomingEvents: 4766,
    dividersBack: null,
    dividersFront: null,
    navigationBack: null,
    navigationFront: null,
    submit: null
  }
];