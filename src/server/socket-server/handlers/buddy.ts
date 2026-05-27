import { PenguinHandler } from "./handlers";
import { formatBuddyEntry } from "./join";

export const handleGetIgnoreList: PenguinHandler<[]> = async ({ msg, penguin, world, db }) => {
  const ignored = await Promise.all(penguin.buddy.ignored.map(id => {
    return formatBuddyEntry(id, world, db, true);
  }));
  msg.send(penguin, 'gn', ...ignored);
}

export const handleAddIgnore: PenguinHandler<[number]> = ({ penguin, prst }, ignoreId) => {
  penguin.buddy.ignore(ignoreId);
  prst(penguin);
}

export const handleRemoveIgnore: PenguinHandler<[number]> = ({ penguin, prst }, ignoreId) => {
  penguin.buddy.unignore(ignoreId);
  prst(penguin);
}