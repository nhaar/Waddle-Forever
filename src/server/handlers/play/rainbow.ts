import { isRainbowStage, RainbowPuffleStage } from "../../../server/database";
import { Handler } from "..";

const handler = new Handler();

/** Status of the item and coin rewards of each task */
enum ItemStatus {
  // can't because is a non-member or haven't done task
  CannotCollect = 0,
  NotCollected = 1,
  Collected = 2
}

/** Status of each rainbow puffle task that the client consumes */
type Task = {
  /** Status of the item reward */
  item: ItemStatus
  /** Status of the coin reward */
  coin: ItemStatus
  /** If have completed this task */
  completed: boolean
}

/** Information the client consumes of the quest progress */
type RainbowQuestStatus = {
  /** ID of current task waiting to be done */
  currTask: number,
  /** Timestamp for when the next task is available, in seconds */
  taskAvail: number,
  /** Integer boolean for whether or not can collect bonus */
  bonus: number,
  /** Boolean for whether or not can use the cannon */
  cannon: boolean,
  /** Number of quests completed */
  questsDone: number,
  /** String of the number of hours remaining for next task */
  hoursRemaining: string,
  /** String of the number of minutes remaining for next task */
  minutesRemaining: string,
  /** Map of all task IDs and their task status */
  tasks: Record<number, Task>
}

/** Item reward obtained at the end of each quest in order */
const RAINBOW_QUEST_REWARDS = [6158, 4809, 1560, 3159];

/** Item obtained from the bonus reward */
const RAINBOW_BONUS_REWARD = 5220;

// sending the rainbow puffle quest data
handler.xt('rpq#rpqd', (client) => {
  // time in minutes between each task
  // TODO this changed with time, by 2014 it was already 20 minutes
  // but at some point in 2013 it was 18 hours
  const waitTime = client.settings.no_rainbow_quest_wait ? 0 : 20;

  let currentTask = client.penguin.rainbowQuestInfo.currentTask;

  // TODO unsure of why this condition is needed
  if (currentTask === RAINBOW_QUEST_REWARDS.length && !client.penguin.rainbowQuestInfo.adoptability) {
    currentTask = 0;
  }

  // default values if haven't completed anything before (doesn't need to wait)
  let minutesRemaining = 0;
  let hoursRemaining = 0;
  let taskAvail = 0;

  // must use timestamp in seconds for the client
  const currentTimestamp = Date.now() / 1000;
  const taskCompletion = client.penguin.rainbowQuestInfo.latestTaskCompletionTime;
  // if have completed task, update the waiting times accordingly
  if (taskCompletion !== undefined) {
    taskAvail = Math.floor(taskCompletion + waitTime * 60);
    const secondsRemaining = taskAvail - currentTimestamp;
    minutesRemaining = Math.floor(secondsRemaining / 60);
    hoursRemaining = Math.floor(secondsRemaining / 60 / 60);
  }

  const bonus = Number(currentTask === RAINBOW_QUEST_REWARDS.length && !client.penguin.rainbowQuestInfo.coinsCollected.has('bonus'));

  const tasks: Record<number, Task> = {};

  for (let taskId = 0; taskId < RAINBOW_QUEST_REWARDS.length; taskId++) {
    const strTask = String(taskId);
    tasks[taskId] = {
      item: client.penguin.hasItem(RAINBOW_QUEST_REWARDS[taskId])
        ? 2
        : client.penguin.isMember
          ? 1
          : 0,
      coin: isRainbowStage(strTask) && client.penguin.rainbowQuestInfo.coinsCollected.has(strTask)
        ? 2
        : taskId < currentTask
          ? 1
          : 0,
      completed: taskId < currentTask
    }
  }

  const rainbowQuestStatus: RainbowQuestStatus = {
    currTask: Math.min(currentTask, RAINBOW_QUEST_REWARDS.length - 1),
    taskAvail,
    bonus,
    cannon: client.penguin.rainbowQuestInfo.adoptability,
    questsDone: currentTask,
    hoursRemaining: String(hoursRemaining),
    minutesRemaining: String(Math.max(0, minutesRemaining + 1)),
    tasks
  }

  client.sendXt('rpqd', JSON.stringify(rainbowQuestStatus));
})

// rainbow puffle quest task complete
handler.xt('rpq#rpqtc', (client, task) => {
  // completing last quest, can adopt
  if (Number(task) === RAINBOW_QUEST_REWARDS.length - 1) {
    client.penguin.rainbowQuestInfo.adoptability = true;
  }

  client.penguin.rainbowQuestInfo.currentTask = Number(task) + 1;
  client.penguin.rainbowQuestInfo.latestTaskCompletionTime = Date.now() / 1000;
  client.update();
})

// rainbow puffle quest collect coins
handler.xt('rpq#rpqcc', (client, task) => {
  if (isRainbowStage(task)) {
    client.penguin.rainbowQuestInfo.coinsCollected.add(task);
  }
  client.penguin.addCoins(150);
  client.sendXt('rpqcc', task, ItemStatus.Collected, client.penguin.coins);
  client.update();
});

// rainbow puffle quest item collect
handler.xt('rpq#rpqic', (client, task) => {
  client.buyItem(RAINBOW_QUEST_REWARDS[Number(task)], { notify: false });
  client.sendXt('rpqic', task, ItemStatus.Collected);
  client.update();
});

// rainbow puffle quest bonus collect
handler.xt('rpq#rpqbc', (client) => {
  // if have item, already completed the quest once
  if (client.penguin.hasItem(RAINBOW_BONUS_REWARD)) {
    // TODO get evidence this reward amount is correct
    client.penguin.addCoins(500);
    // TODO unsure why these 2 zeros
    client.sendXt('rpqbc', 0, 0, client.penguin.coins);
  } else {
    client.buyItem(RAINBOW_BONUS_REWARD);
  }
  client.penguin.rainbowQuestInfo.coinsCollected.add('bonus');
  client.update();
})

export default handler;