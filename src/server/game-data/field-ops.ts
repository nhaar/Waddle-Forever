type Minigame = 'chipmaze'
  | 'circuitmatch'
  | 'codebreak'
  | 'commandline'
  | 'firewall';

enum Mascot {
  Gary = "25"
}

interface FieldOp {
  room_id: number,
  // the x/y pos is the center of a 70x70 rectangle
  // all of the values set for these are guesses,
  // because it's impossible to know what it was exactly without the full JSONs archived
  x_pos: number,
  y_pos: number,
  game_id: Minigame,
  mascot_id: Mascot, // who is talking in the end message
  task: string, // displays in the spy phone while field op is in progress
  description: string, // displays in the UI in the command room
  end_message: string // displays when field op is completed (added after field op #30)
}

export const FIELD_OPS: Record<number, FieldOp> = {
  1: {
    room_id: 100,
    x_pos: 410,
    y_pos: 210,
    game_id: 'circuitmatch',
    mascot_id: null,
    task: "Disarm the popcorn device \"near a big letter S\".",
    description: "Calling all agents!\n\nWe've learned that Herbert has concealed a highly dangerous popcorn device \"near a big letter S\".\n\nWork together to find it, then shut it down with your Spy Phone. Time is running out!",
    end_message: ""
  },
  2: {
    room_id: 230,
    x_pos: 365,
    y_pos: 185,
    game_id: 'chipmaze',
    mascot_id: null,
    task: "Power up the antenna. It's disguised somewhere up high.",
    description: "Calling all agents!\n\nOur security system is offline - a broken antenna has left us defenseless!\n\nSensors show the antenna is up high, but disguised. Search the island, then use your phone to fix it!",
    end_message: ""
  },
  3: {
    room_id: 813,
    x_pos: 530,
    y_pos: 165,
    game_id: 'circuitmatch',
    mascot_id: null,
    task: "Find the lost Spy Phone near a \"large light bulb\", then destroy it.",
    description: "Calling all agents!\n\nWe've detected an old PSA Spy Phone lost near a \"large light bulb\". It must not be found by Herbert!\n\nSearch the island for the phone, then destroy it by overloading its circuits. We're counting on you!",
    end_message: ""
  },
  4: {
    room_id: 221,
    x_pos: 160,
    y_pos: 275,
    game_id: 'chipmaze',
    mascot_id: null,
    task: "Search for the broken surveillance network computer, then power it up. It's disguised inside a couch.",
    description: "Calling all agents!\n\nOur surveillance network has had a major black out. We're not sure what, or who, is responsible.\n\nThe broken network computer is disguised inside a couch. Search the island for it, then power it up!",
    end_message: ""
  },
  5: {
    room_id: 809,
    x_pos: 353,
    y_pos: 160,
    game_id: 'circuitmatch',
    mascot_id: null,
    task: "Search for the dangerous microphone, then shut it down.",
    description: "Calling all agents!\n\nWe've uncovered evidence that someone is planning to ruin Music Jam. We must act immediately!\n\nA microphone has been set to overload and wreck the sound systems. Search for it, then shut it down!",
    end_message: ""
  },
  6: {
    room_id: 122,
    x_pos: 695,
    y_pos: 360,
    game_id: 'firewall',
    mascot_id: null,
    task: "Search for the computer being used by someone to attack the EPF system, then shut it down.",
    description: "Calling all agents!\n\nSomeone is using a computer to attack our system! The scanner is holding... for now. Search the island with other agents for the computer responsible, then shut it down. You must hurry!",
    end_message: ""
  },
  7: {
    room_id: 411,
    x_pos: 230,
    y_pos: 240,
    game_id: 'chipmaze',
    mascot_id: null,
    task: "Search the Beacon for the broken power system, then power it up.",
    description: "We've detected a malfunction with part of the Beacon's power system. The light could burn out any moment!\n\nThe Beacon is vital to public safety. Work together to find the broken system, then power it up.",
    end_message: ""
  },
  8: {
    room_id: 321,
    x_pos: 535,
    y_pos: 335,
    game_id: 'circuitmatch',
    mascot_id: null,
    task: "Search near the Dojo. Look for technology that ninjas don't normally use, then shut it down.",
    description: "We've detected a possible threat somewhere near the Dojo. The ninjas may be in danger!\n\nSearch the area together. Look for technology that ninjas don't normally use, then shut it down. Hurry!",
    end_message: ""
  },
  9: {
    room_id: 802,
    x_pos: 550,
    y_pos: 115,
    game_id: 'firewall',
    mascot_id: null,
    task: "Investigate the island's cash registers. Fix the one that sets off your Spy Phone.",
    description: "Someone has been tampering with the island's coin supply. We must handle this situation quietly!\n\nInvestigate the island's cash registers. Fix the one that sets off your Spy Phone. Good luck!",
    end_message: ""
  },
  10: {
    room_id: 110,
    x_pos: 450,
    y_pos: 210,
    game_id: 'chipmaze',
    mascot_id: null,
    task: "Go to the Coffee Shop. Power up a new safety override for the steamer.",
    description: "We have a situation: Someone has tampered with the steamer in the Coffee Shop. It's turned up to dangerous levels!\n\nGo there, and power up a new safety override for the steamer. Make sure all citizens are safe. You must hurry!",
    end_message: ""
  },
  11: {
    room_id: 410,
    x_pos: 20,
    y_pos: 415,
    game_id: 'circuitmatch',
    mascot_id: null,
    task: "Search the island together for the dangerous speaker, then shut it down.",
    description: "We've received information that a speaker somewhere has been rigged to cause \"serious damage.\"\n\nSearch the island together for it, then shut down. We can't take any chances!",
    end_message: ""
  },
  12: {
    room_id: 801,
    x_pos: 665,
    y_pos: 165,
    game_id: 'chipmaze',
    mascot_id: null,
    task: "Work together at the Clock Tower to power up a new security system. Do not alert the public.",
    description: "We've detected some strange readings from the Clock Tower... We need to make sure it's safe to use.\n\nWork together at the Snow Forts to power up a new security system. Make sure not to alert the public!",
    end_message: ""
  },
  13: {
    room_id: 814,
    x_pos: 90,
    y_pos: 395,
    game_id: 'firewall',
    mascot_id: null,
    task: "Track down the wrecked vehicle, then shut down its computer.",
    description: "We're receiving a distress signal from a wrecked vehicle. Its technology could be used against us!\n\nWork together to track it down, then shut down its computer. It could be anywhere... Good luck!",
    end_message: ""
  },
  14: {
    room_id: 805,
    x_pos: 175,
    y_pos: 115,
    game_id: 'chipmaze',
    mascot_id: null,
    task: "You have one part of a new radio scanner. Find a place out at sea to power it up.",
    description: "We must find out who's been vandalizing the island. We suspect it may not be Herbert...\n\nWe need a new radio scanner. Work together to install the first part, out at sea. Good luck!",
    end_message: ""
  },
  15: {
    room_id: 400,
    x_pos: 80,
    y_pos: 205,
    game_id: 'firewall',
    mascot_id: null,
    task: "Search the island for the broken scanner part, and restart its system. It's disguised as a buoy.",
    description: "The scanner is only half done, but it's already been damaged. Someone is sabotaging us!\n\nWork together to find the broken part, and restart the system. It's disguised as a buoy.",
    end_message: ""
  },
  16: {
    room_id: 121,
    x_pos: 100,
    y_pos: 290,
    game_id: 'chipmaze',
    mascot_id: null,
    task: "Find a place to hide the new scanner part, and power it up. I suggest behind a curtain.",
    description: "The new scanner is almost done. Next week I'll have a new Field-Ops tool ready for you.\n\nWork together to install the last part. Look for a place to hide it. I suggest behind a curtain.",
    end_message: ""
  },
  17: {
    room_id: 806,
    x_pos: 435,
    y_pos: 265,
    game_id: 'codebreak',
    mascot_id: null,
    task: "Use your Spy Phone to find an enemy signal underground. Use your new scanner to intercept it, and send it to G.",
    description: "The new scanner is online! We can now locate and intercept radio signals. Great work!\n\nWork together to find an enemy signal, and send it to me. I believe they may be underground.",
    end_message: ""
  },
  18: {
    room_id: 800,
    x_pos: 55,
    y_pos: 280,
    game_id: 'circuitmatch',
    mascot_id: null,
    task: "G believes a water vehicle may have been tampered with. Investigate, and disable any enemy devices.",
    description: "The signal we intercepted last week was strange. It was just a series of snapping noises.\n\nWe have a hunch. Work together to check all water vehicles for tampering. You must hurry!",
    end_message: ""
  },
  19: {
    room_id: 400,
    // TODO: according to https://youtu.be/wgAQ1HH_Owo?t=26,
    // it appears that this had a larger hit area than just these coordinates
    // (the right side below the bucket). it's possible they used an
    // actual room trigger for this, which would need recreated.
    x_pos: 550,
    y_pos: 395,
    game_id: 'codebreak',
    mascot_id: null,
    task: "Search the island for more enemy signals to intercept. This info is vital to G's research.",
    description: "Whoever is sabotaging our investigation is very skilled. I'm working on new technology to aid us.\n\nHowever, we need more information. Work together to look for more enemy signals. Check near the ocean.",
    end_message: ""
  },
  20: {
    room_id: 808,
    x_pos: 265,
    y_pos: 185,
    game_id: 'chipmaze',
    mascot_id: null,
    task: "Power up the EPF's new defenses. The last part is disguised as a telephone. G will have new technology for you next week.",
    description: "The signal we found was just more snapping noises. We have no choice - we must prepare our new defenses.\n\nWork together to power up the last part for next week. It's disguised as a telephone.",
    end_message: ""
  },
  21: {
    room_id: 323,
    x_pos: 200,
    y_pos: 105,
    game_id: 'commandline',
    mascot_id: null,
    task: "Search the EPF computers for the infected systems, and repair them. Use the new Spy Phone tool G has created.",
    description: "Red alert! Our new defenses have detected an advanced computer bug. We're under attack!\n\nWork together to find the infected EPF computer, and fix it. You must hurry!",
    end_message: ""
  },
  22: {
    room_id: 814,
    x_pos: 155,
    y_pos: 145,
    game_id: 'circuitmatch',
    mascot_id: null,
    task: "Work together to search every barrel on the island. Shut down any enemy devices you find.",
    description: "We're still under attack! We've detected what may be a popcorn device - we must prevent another incident!\n\nThe device has been hidden inside a barrel. Work together to search the island, then shut it down.",
    end_message: ""
  },
  23: {
    room_id: 212,
    x_pos: 380,
    y_pos: 230,
    game_id: 'firewall',
    mascot_id: null,
    task: "Equipment in the Everyday Phoning Facility has been infected. Work together to crack security, and repair the system.",
    description: "Our enemies are still attacking! They've infected systems in the Everyday Phoning Facility - we're locked out!\n\nWork together to find and repair the locked system. You'll need to break through EPF security. Good luck!",
    end_message: ""
  },
  24: {
    room_id: 213,
    x_pos: 350,
    y_pos: 255,
    game_id: 'chipmaze',
    mascot_id: null,
    task: "Use the Tube Transport to go to the VR HQ. Work together to look for the broken hologram panel, and power it up.",
    description: "We're still on Red Alert! Enemy programs have damaged systems in the VR Hologram Quarters.\n\nTravel down to the VR HQ, and find the broken hologram panel. Work together to power it up.",
    end_message: ""
  },
  25: {
    room_id: 810,
    x_pos: 645,
    y_pos: 430,
    game_id: 'codebreak',
    mascot_id: null,
    task: "", // unknown - searched a bunch of videos but couldn't find it
    description: "The attacks on the EPF have stopped. Our enemies have gone quiet - thanks to the effort of our agents.\n\nWe must act. Work together to look for any new enemy signals. Search near the ocean - it's our only clue.",
    end_message: ""
  },
  26: {
    room_id: 300,
    x_pos: 420,
    y_pos: 210,
    game_id: 'chipmaze',
    mascot_id: null,
    task: "Search the island for a 'booth' that's been tampered with. Repair any damage you find.",
    description: "The signal we decoded last week said, \"Our plan is working! Get the parts from the booth!\"\n\nWe must investigate. Work together to look for this 'booth' and repair any damage you find.",
    end_message: ""
  },
  27: {
    room_id: 200,
    x_pos: 400,
    y_pos: 200,
    game_id: 'codebreak',
    mascot_id: null,
    task: "Strange tire tracks were found leading to the Ski Village. Search there for any enemy signals.",
    description: "We have a clue! After last week's Field-Operation, strange tire tracks were found leaving the scene.\n\nThe hidden tracks led right to the Ski Village. Search there for more enemy signals.",
    end_message: ""
  },
  28: {
    room_id: 120,
    x_pos: 575,
    y_pos: 340,
    game_id: 'commandline',
    mascot_id: null,
    task: "Work together to search for the damaged speakers, and repair them. G is investigating who is behind this.",
    description: "We've decoded the message from last week: \"They're onto us! Get what we need from the speakers - now!\"\n\nThere's something strangely familiar about all this... For now, find the speakers and fix any damage.",
    end_message: ""
  },
  29: {
    room_id: 814,
    x_pos: 90,
    y_pos: 395,
    game_id: 'circuitmatch',
    mascot_id: null,
    task: "Someone is trying to steal Aquagrabber parts. Make sure they're safe, and take any unsecured parts offline.",
    description: "The Aquagrabber's security systems just stopped an intruder from stealing its parts!\n\nWe must act quickly. Work together to make sure all other Aquagrabbers are secure.",
    end_message: ""
  },
  30: {
    room_id: 230,
    x_pos: 345,
    y_pos: 115,
    game_id: 'chipmaze',
    mascot_id: Mascot.Gary,
    task: "G needs help finishing a new Spy Phone feature. Work together to upgrade the EPF radio antenna. It's located somewhere up high.",
    description: "More parts have gone missing. A cart was stolen from the Mine, along with a set of inner tubes from the Docks.\n\nWe must be prepared. I'm working on a new Spy Phone feature. Help me finish it by upgrading the EPF radio antenna.",
    end_message: "Good work Agent! Thanks to you and your fellow agents, the new Communication System is online.\n\nYou will now receive messages from EPF command through your Spy Phone."
  }
}