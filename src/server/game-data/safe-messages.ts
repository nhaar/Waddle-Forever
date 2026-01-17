type SafeMessage = {
  id: number;
  name: string;
} & ({} | {
  menu: SafeMessage[];
  wide?: number;
} | {
  action: string;
});

export const SAFE_MESSAGES: SafeMessage[] = [
  { id: 1, name: "Hello", menu: [
      { id: 100, name: "Hi", menu: [
          { id: 101, name: "Hi there!"
          },
          { id: 102, name: "Hi everyone"
          }
        ]
      },
      { id: 120, name: "Greetings", wide: 2, menu: [
          { id: 121, name: "Greetings everyone"
          },
          { id: 122, name: "Greetings Earthling"
          }
        ]
      },
      { id: 130, name: "Welcome", menu: [
          { id: 131, name: "Welcome to my igloo"
          },
          { id: 132, name: "Welcome back!"
          }
        ]
      },
      { id: 140, name: "Hey there!"
      },
      { id: 150, name: "What\'s up?", menu: [
          { id: 151, name: "How are you doing?"
          },
          { id: 152, name: "How\'s it going?"
          },
          { id: 153, name: "What\'s new?"
          }
        ]
      },
      { id: 160, name: "Good day", menu: [
          { id: 161, name: "Good morning"
          },
          { id: 162, name: "Good afternoon"
          },
          { id: 163, name: "Good night"
          },
          { id: 164, name: "Good evening"
          }
        ]
      },
      { id: 170, name: "Silly", menu: [
          { id: 171, name: "Hulloo"
          },
          { id: 172, name: "Waz up?"
          },
          { id: 173, name: "Ahoy!"
          },
          { id: 174, name: "Come in agent!"
          }
        ]
      }
    ]
  },
  { id: 2, name: "Goodbye", menu: [
      { id: 210, name: "Later", menu: [
          { id: 211, name: "See you tomorrow"
          },
          { id: 212, name: "See you later"
          }
        ]
      },
      { id: 220, name: "Bye"
      },
      { id: 230, name: "I\'ll be right back"
      },
      { id: 240, name: "I have to go"
      },
      { id: 250, name: "Farewell", menu: [
          { id: 251, name: "Take care"
          },
          { id: 252, name: "Have a nice day!"
          },
          { id: 253, name: "Good luck!"
          },
          { id: 254, name: "Enjoy!"
          },
          { id: 255, name: "Cheers"
          },
          { id: 256, name: "Ta ta for now!"
          }
        ]
      },
      { id: 260, name: "Peace!"
      }
    ]
  },
  { id: 3, name: "Friend", wide: 2, menu: [
      { id: 300, name: "Wanna be friends?"
      },
      { id: 310, name: "Follow me", menu: [
          { id: 311, name: "Come to my igloo"
          },
          { id: 312, name: "Party at my place!"
          }
        ]
      },
      { id: 320, name: "I like ...", menu: [
          { id: 321, name: "I like your outfit!"
          },
          { id: 322, name: "I like your igloo!"
          },
          { id: 323, name: "I like your puffles!"
          },
          { id: 324, name: "I like your hair!"
          }
        ]
      },
      { id: 330, name: "Thank you", menu: [
          { id: 331, name: "Thanks for playing"
          },
          { id: 332, name: "Thanks for visiting"
          },
          { id: 333, name: "No, thank you"
          }
        ]
      },
      { id: 340, name: "No problem"
      },
      { id: 350, name: "You are ...", wide: 2, menu: [
          { id: 351, name: "You are great!"
          },
          { id: 352, name: "You are cool!"
          },
          { id: 353, name: "You are funny!"
          },
          { id: 354, name: "You are silly!"
          },
          { id: 355, name: "You are awesome!"
          },
          { id: 356, name: "You are a good friend!"
          }
        ]
      },
      { id: 360, name: "Igloo", wide: 2, menu: [
          { id: 361, name: "Cool igloo!"
          },
          { id: 362, name: "Great decorating!"
          },
          { id: 363, name: "Awesome design"
          },
          { id: 364, name: "I like your igloo"
          },
          { id: 365, name: "Great party!"
          },
          { id: 366, name: "Thanks for coming to my party!"
          },
          { id: 367, name: "Your puffles look hungry."
          }
        ]
      },
      { id: 370, name: "Sorry", menu: [
          { id: 371, name: "Sorry, I am busy"
          },
          { id: 372, name: "Sorry, I need to go"
          },
          { id: 373, name: "Please forgive me"
          },
          { id: 374, name: "I forgive you"
          }
        ]
      }
    ]
  },
  { id: 4, name: "Questions", menu: [
      { id: 400, name: "What?", wide: 2, menu: [
          { id: 401, name: "What is your favorite animal?"
          },
          { id: 402, name: "What is your favorite game?"
          },
          { id: 403, name: "What is your favorite sport?"
          },
          { id: 405, name: "What is your favorite music?"
          },
          { id: 407, name: "What are your hobbies?"
          }
        ]
      },
      { id: 410, name: "Where?", wide: 2, menu: [
          { id: 412, name: "Where do you want to go?"
          },
          { id: 413, name: "Where are you going?"
          },
          { id: 414, name: "Where did you find that?"
          },
          { id: 415, name: "Where did you find that pin?"
          }
        ]
      },
      { id: 420, name: "When?", wide: 2, menu: [
          { id: 421, name: "When is your party?"
          },
          { id: 422, name: "When are rehearsals?"
          }
        ]
      },
      { id: 430, name: "How are you today?"
      },
      { id: 450, name: "Can I have a tour?"
      },
      { id: 460, name: "EPF", wide: 2, menu: [
          { id: 461, name: "Pssst. I want to be an EPF Agent. Can you send me an invite?"
          }
        ]
      }
    ]
  },
  { id: 5, name: "Answers", menu: [
      { id: 10000, name: "Animals", menu: [
          { id: 10100, name: "Cats", menu: [
              { id: 10101, name: "Lion"
              },
              { id: 10102, name: "Tiger"
              },
              { id: 10103, name: "Leopard"
              },
              { id: 10104, name: "Cheetah"
              }
            ]
          },
          { id: 10200, name: "Dogs", menu: [
              { id: 10201, name: "Beagle"
              },
              { id: 10202, name: "Collie"
              },
              { id: 10203, name: "Dalmatian"
              },
              { id: 10204, name: "Poodle"
              },
              { id: 10205, name: "Spaniel"
              },
              { id: 10206, name: "Shepherd"
              },
              { id: 10207, name: "Terrier"
              },
              { id: 10208, name: "Retriever"
              },
              { id: 10209, name: "Wolf"
              }
            ]
          },
          { id: 10300, name: "Horses"
          },
          { id: 10400, name: "Reptiles", menu: [
              { id: 10410, name: "Lizard"
              },
              { id: 10420, name: "Turtle"
              },
              { id: 10430, name: "Snake"
              }
            ]
          },
          { id: 10500, name: "Hamster"
          },
          { id: 10600, name: "Monkey"
          },
          { id: 10700, name: "Bears"
          },
          { id: 10800, name: "Fish", menu: [
              { id: 10810, name: "Goldfish"
              }
            ]
          },
          { id: 10900, name: "Birds", menu: [
              { id: 10901, name: "Penguin"
              }
            ]
          },
          { id: 11000, name: "Elephants"
          },
          { id: 12000, name: "Puffles", wide: 2, menu: [
              { id: 12001, name: "Cute puffles"
              },
              { id: 12002, name: "Cool puffles"
              },
              { id: 12003, name: "Your puffles are hungry"
              },
              { id: 12004, name: "Let\'s walk our puffles"
              }
            ]
          }
        ]
      },
      { id: 50000, name: "Games", menu: [
          { id: 51100, name: "Astro Barrier"
          },
          { id: 51150, name: "Aqua Grabber"
          },
          { id: 51300, name: "Bean Counters"
          },
          { id: 51320, name: "Cart Surfer"
          },
          { id: 51321, name: "Catchin Waves"
          },
          { id: 51330, name: "Find Four"
          },
          { id: 51200, name: "Hydro-Hopper"
          },
          { id: 51350, name: "Ice Fishing"
          },
          { id: 51360, name: "Jet Pack Adventure"
          },
          { id: 51400, name: "Mancala"
          }
        ]
      },
      { id: 52000, name: "More Games", menu: [
          { id: 51420, name: "Paint By Letters"
          },
          { id: 51450, name: "Pizzatron 3000"
          },
          { id: 51500, name: "Sled Racing"
          },
          { id: 51600, name: "Puffle Round-Up"
          },
          { id: 51700, name: "Thin Ice"
          },
          { id: 51750, name: "Treasure Hunt"
          },
          { id: 51760, name: "DJ3K"
          }
        ]
      },
      { id: 20000, name: "Sports", menu: [
          { id: 20100, name: "Hockey"
          },
          { id: 20200, name: "Baseball"
          },
          { id: 20300, name: "Basketball"
          },
          { id: 20400, name: "Football"
          },
          { id: 20500, name: "Soccer"
          },
          { id: 20600, name: "Volleyball"
          },
          { id: 20700, name: "Water sports", menu: [
              { id: 20710, name: "Water Ski"
              },
              { id: 20720, name: "Wakeboard"
              },
              { id: 20730, name: "Ski Biscuit"
              },
              { id: 20740, name: "Swimming"
              }
            ]
          },
          { id: 20800, name: "Winter Sports", menu: [
              { id: 20810, name: "Skiing", menu: [
                  { id: 20811, name: "Cross Country"
                  },
                  { id: 20812, name: "Downhill"
                  }
                ]
              },
              { id: 20820, name: "Sledding"
              },
              { id: 20830, name: "Snowboard"
              },
              { id: 20840, name: "Skating"
              }
            ]
          },
          { id: 20900, name: "Adventure", menu: [
              { id: 20910, name: "Hiking"
              },
              { id: 20920, name: "Rock Climbing"
              },
              { id: 20930, name: "Fishing"
              }
            ]
          }
        ]
      },
      { id: 40000, name: "Music", menu: [
          { id: 41000, name: "Country"
          },
          { id: 42000, name: "Jazz"
          },
          { id: 43000, name: "Rap"
          },
          { id: 44000, name: "Hip-Hop"
          },
          { id: 45000, name: "Classical"
          },
          { id: 46000, name: "Pop"
          },
          { id: 47000, name: "Rock"
          },
          { id: 48000, name: "Techno"
          }
        ]
      },
      { id: 60000, name: "Hobbies", menu: [
          { id: 61000, name: "Reading", menu: [
              { id: 61100, name: "Fiction books"
              },
              { id: 61200, name: "Non-fiction books"
              },
              { id: 61300, name: "Comics"
              },
              { id: 61400, name: "Magazines"
              }
            ]
          },
          { id: 62000, name: "The Internet"
          },
          { id: 63000, name: "Dance", menu: [
              { id: 63100, name: "Ballet"
              },
              { id: 63200, name: "Tap dance"
              },
              { id: 63300, name: "Jazz dance"
              },
              { id: 63400, name: "Hip Hop dance"
              },
              { id: 63500, name: "Modern dance"
              }
            ]
          },
          { id: 64000, name: "Gymnastics"
          },
          { id: 65000, name: "Martial Arts", menu: [
              { id: 65100, name: "Karate"
              },
              { id: 65200, name: "Judo"
              },
              { id: 65300, name: "Tae Kwon Do"
              }
            ]
          },
          { id: 66000, name: "Listening to music"
          },
          { id: 67000, name: "Music Lessons", menu: [
              { id: 67100, name: "Playing piano"
              },
              { id: 67200, name: "Playing guitar"
              },
              { id: 67300, name: "Playing the drums"
              }
            ]
          },
          { id: 68000, name: "Arts and Crafts"
          },
          { id: 69000, name: "Hanging Out"
          }
        ]
      },
      { id: 80000, name: "Location", menu: [
          { id: 81000, name: "USA"
          },
          { id: 82000, name: "Canada"
          },
          { id: 82100, name: "Mexico"
          },
          { id: 82200, name: "Central America", menu: [
              { id: 82201, name: "Costa Rica"
              },
              { id: 82202, name: "Haiti"
              }
            ]
          },
          { id: 83000, name: "Europe", menu: [
              { id: 83010, name: "UK", menu: [
                  { id: 83011, name: "England"
                  },
                  { id: 83012, name: "Scotland"
                  },
                  { id: 83013, name: "Wales"
                  },
                  { id: 83014, name: "Ireland"
                  }
                ]
              },
              { id: 83020, name: "France"
              },
              { id: 83030, name: "Germany"
              },
              { id: 83040, name: "Spain"
              },
              { id: 83050, name: "Italy"
              },
              { id: 83060, name: "Poland"
              },
              { id: 83070, name: "Switzerland"
              },
              { id: 83080, name: "Greece"
              }
            ]
          },
          { id: 84000, name: "Asia", menu: [
              { id: 84010, name: "China"
              },
              { id: 84020, name: "India"
              },
              { id: 84030, name: "Indonesia"
              },
              { id: 84040, name: "Japan"
              },
              { id: 84050, name: "Russia"
              }
            ]
          },
          { id: 85000, name: "Australia", menu: [
              { id: 85010, name: "New South Wales"
              },
              { id: 85020, name: "Northern Territory"
              },
              { id: 85030, name: "Queensland"
              },
              { id: 85040, name: "South Australia"
              },
              { id: 85050, name: "Tasmania"
              },
              { id: 85060, name: "Victoria"
              },
              { id: 85070, name: "Western Australia"
              }
            ]
          },
          { id: 86000, name: "Africa"
          },
          { id: 87000, name: "Middle East"
          },
          { id: 88000, name: "South America", menu: [
              { id: 88010, name: "Argentina"
              },
              { id: 88020, name: "Brazil"
              },
              { id: 88030, name: "Chile"
              },
              { id: 88040, name: "Uruguay"
              },
              { id: 88050, name: "Paraguay"
              },
              { id: 88060, name: "Ecuador"
              },
              { id: 88070, name: "Peru"
              },
              { id: 88080, name: "Colombia"
              },
              { id: 88090, name: "Venezuela"
              }
            ]
          },
          { id: 89000, name: "Club Penguin", menu: [
              { id: 89010, name: "Town Center", menu: [
                  { id: 89011, name: "Coffee Shop"
                  },
                  { id: 89012, name: "Book Room"
                  },
                  { id: 89013, name: "Night Club"
                  },
                  { id: 89014, name: "Lounge"
                  },
                  { id: 89015, name: "Gift Shop"
                  },
                  { id: 89016, name: "Boiler Room"
                  }
                ]
              },
              { id: 89020, name: "Ski Village", menu: [
                  { id: 89021, name: "Sport Shop"
                  },
                  { id: 89022, name: "Ski Lodge"
                  },
                  { id: 89023, name: "Lodge Attic"
                  },
                  { id: 89024, name: "Ski Hill"
                  }
                ]
              },
              { id: 89030, name: "The Plaza", menu: [
                  { id: 89031, name: "Pet Shop"
                  },
                  { id: 89033, name: "The Stage"
                  },
                  { id: 89032, name: "Pizza Parlor"
                  },
                  { id: 89034, name: "The Forest"
                  },
                  { id: 89035, name: "The Cove"
                  }
                ]
              },
              { id: 89040, name: "The Beach", menu: [
                  { id: 89041, name: "The Lighthouse"
                  },
                  { id: 89042, name: "Beacon"
                  },
                  { id: 89043, name: "The Migrator"
                  }
                ]
              },
              { id: 89050, name: "Underground", menu: [
                  { id: 89051, name: "The Pool"
                  },
                  { id: 89052, name: "The Mine"
                  }
                ]
              },
              { id: 89080, name: "Other", menu: [
                  { id: 89081, name: "Dock"
                  },
                  { id: 89082, name: "Snow Forts"
                  },
                  { id: 89083, name: "Stadium"
                  },
                  { id: 89084, name: "Iceberg"
                  },
                  { id: 89085, name: "Mine Shack"
                  }
                ]
              },
              { id: 89086, name: "Your igloo"
              },
              { id: 89087, name: "My igloo"
              }
            ]
          }
        ]
      },
      { id: 90000, name: "Mood", menu: [
          { id: 90100, name: "Good"
          },
          { id: 90200, name: "Great!"
          },
          { id: 90300, name: "All right"
          },
          { id: 90400, name: "Not bad"
          }
        ]
      },
      { id: 99998, name: "Boy"
      },
      { id: 99999, name: "Girl"
      }
    ]
  },
  { id: 6, name: "Game", action: "game", wide: 2, menu: [
      { id: 600, name: "Want to play a game?"
      },
      { id: 601, name: "Want to play Sled Racing?"
      },
      { id: 602, name: "Want to play Mancala?"
      },
      { id: 603, name: "Want to play Find Four?"
      },
      { id: 604, name: "Want to play Hockey?"
      },
      { id: 620, name: "Good game!"
      },
      { id: 630, name: "Good move!"
      },
      { id: 640, name: "Play again?"
      },
      { id: 650, name: "Tag!", menu: [
          { id: 651, name: "Tag, you\'re it!"
          },
          { id: 652, name: "You\'re it!"
          }
        ]
      },
      { id: 660, name: "Hide and Seek", wide: 2, menu: [
          { id: 661, name: "I found you!"
          },
          { id: 662, name: "Ready or not, here I come!"
          },
          { id: 663, name: "You found me!"
          },
          { id: 664, name: "10, 9, 8, 7, 6, 5, 4, 3, 2, 1!"
          }
        ]
      }
    ]
  },
  { id: 7, name: "Activities", menu: [
      { id: 701, name: "Tell a joke", action: "joke"
      },
      { id: 702, name: "Give a tour", action: "tour"
      },
      { id: 710, name: "Event", menu: [
          { id: 711, name: "Party", wide: 2, menu: [
              { id: 712, name: "Party at my igloo"
              }
            ]
          },
          { id: 716, name: "Fashion show", wide: 2, menu: [
              { id: 717, name: "Fashion show at my igloo"
              }
            ]
          },
          { id: 721, name: "Auditions", wide: 2, menu: [
              { id: 722, name: "Auditions at my igloo"
              },
              { id: 723, name: "Dress rehearsal at my igloo"
              }
            ]
          },
          { id: 726, name: "Concert", wide: 2, menu: [
              { id: 727, name: "Concert at my igloo"
              }
            ]
          },
          { id: 731, name: "Practice", wide: 2, menu: [
              { id: 732, name: "Practice at my igloo"
              }
            ]
          },
          { id: 736, name: "Contest", wide: 2, menu: [
              { id: 737, name: "Contest at my igloo"
              }
            ]
          }
        ]
      },
      { id: 738, name: "Colors!", wide: 2, menu: [
          { id: 739, name: "Everyone turn red!"
          },
          { id: 740, name: "Everyone turn yellow!"
          },
          { id: 741, name: "Everyone turn blue!"
          },
          { id: 742, name: "Everyone turn green!"
          },
          { id: 743, name: "Everyone turn pink!"
          },
          { id: 744, name: "Everyone turn black!"
          },
          { id: 745, name: "Everyone turn purple!"
          },
          { id: 746, name: "Everyone turn orange!"
          }
        ]
      },
      { id: 750, name: "Time", menu: [
          { id: 751, name: "In 5 minutes"
          },
          { id: 752, name: "In 10 minutes"
          },
          { id: 753, name: "In 15 minutes"
          },
          { id: 754, name: "In 30 minutes"
          },
          { id: 755, name: "In an hour"
          },
          { id: 756, name: "Today"
          },
          { id: 757, name: "Tomorrow"
          },
          { id: 758, name: "Yesterday"
          }
        ]
      },
      { id: 790, name: "Days of the week", menu: [
          { id: 791, name: "Monday"
          },
          { id: 792, name: "Tuesday"
          },
          { id: 793, name: "Wednesday"
          },
          { id: 794, name: "Thursday"
          },
          { id: 795, name: "Friday"
          },
          { id: 796, name: "Saturday"
          },
          { id: 797, name: "Sunday"
          }
        ]
      }
    ]
  },
  { id: 8, name: "Grub!", menu: [
      { id: 801, name: "That was not nice"
      },
      { id: 802, name: "Please go away"
      },
      { id: 803, name: "Stop that!"
      },
      { id: 804, name: "Nevermind"
      },
      { id: 805, name: "Aaaaaah!"
      },
      { id: 806, name: "Shiver me timbers"
      }
    ]
  },
  { id: 10, name: "Hurray!", menu: [
      { id: 851, name: "Woo hoo!"
      },
      { id: 852, name: "All right!"
      },
      { id: 853, name: "Yay!"
      },
      { id: 854, name: "Great performance!"
      },
      { id: 855, name: "Great job!"
      }
    ]
  },
  { id: 20, name: "Yes"
  },
  { id: 21, name: "No"
  },
  { id: 22, name: "Ok"
  }
];
