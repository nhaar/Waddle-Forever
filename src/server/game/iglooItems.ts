import { GameVersion } from "../settings";

export function getFlooringCost(flooring: number, version: GameVersion = '2010-Nov-24') {
  switch (flooring) {
    case 0: // Remove flooring
      return 20
    case 1: // Terracotta
      return 680
    case 4: // Burgundy carpet
      return 530
    case 7: // Dance floor
      return 1000
    case 9: // Bamboo floor
      return 370
    case 14: // Phony-Lawn
      return 700
    case 17: // Pink carpet
      return 530
    case 20: // Cobblestone
      return 1200
    case 21: // Snowy Floor
      return 400
    case 22: // Lime Green Carpet
      return 530
    default:
      return 0;
  }
}

export function getIglooCost(igloo: number, version: GameVersion = '2010-Nov-24') {
  switch (igloo) {
    case 2: // Candy Igloo
      return 1500
    case 6: // Snow Igloo
      return 1000
    case 8: // Secret Deluxe Stone Igloo
      return 5000
    case 9: // Deluxe Snow Igloo
      return 3000
    case 12: // Gym
      return 4800
    case 13: // Split Level Igloo
      return 4600
    case 14: // Candy Split Level Igloo
      return 4600
    case 16: // Ice Castle
      return 5100
    case 18: // Fish Bowl
      return 2400
    case 20: // Jack O' Lantern
      return 2700
    case 22: // Pink Ice Palace
      return 4900
    case 30: // Snowy Backyard Igloo
      return 3500
    case 33: // Grey Ice Castle
      return 4500
    case 35: // Cozy Cottage
      return 2500
  }
}