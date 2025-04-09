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
  // TODO this changed with time + ability to remove this
  const waitTime = 20;

  let currentTask = client.penguin.rainbow.currentTask;

  // TODO unsure of why this condition is needed
  if (currentTask === RAINBOW_QUEST_REWARDS.length && !client.penguin.rainbow.adoptability) {
    currentTask = 0;
  }

  // default values if haven't completed anything before (doesn't need to wait)
  let minutesRemaining = 0;
  let hoursRemaining = 0;
  let taskAvail = 0;

  // must use timestamp in seconds for the client
  const currentTimestamp = Date.now() / 1000;
  const taskCompletion = client.penguin.rainbow.latestTaskCompletionTime;
  // if have completed task, update the waiting times accordingly
  if (taskCompletion !== undefined) {
    taskAvail = Math.floor(taskCompletion + waitTime * 60);
    const secondsRemaining = taskAvail - currentTimestamp;
    minutesRemaining = Math.floor(secondsRemaining / 60);
    hoursRemaining = Math.floor(secondsRemaining / 60 / 60);
  }

  const bonus = Number(currentTask === RAINBOW_QUEST_REWARDS.length && !client.penguin.rainbow.coinsCollected['bonus']);

  const tasks: Record<number, Task> = {};

  for (let taskId = 0; taskId < RAINBOW_QUEST_REWARDS.length; taskId++) {
    tasks[taskId] = {
      item:  client.penguin.inventory[RAINBOW_QUEST_REWARDS[taskId]] === 1
        ? 2
        : client.penguin.is_member
          ? 1
          : 0,
      coin: client.penguin.rainbow.coinsCollected[String(taskId)]
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
    cannon: client.penguin.rainbow.adoptability,
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
    client.penguin.rainbow.adoptability = true;
  }

  client.penguin.rainbow.currentTask = Number(task) + 1;
  client.penguin.rainbow.latestTaskCompletionTime = Date.now() / 1000;
  client.update();
})

// rainbow puffle quest collect coins
handler.xt('rpq#rpqcc', (client, task) => {
  client.penguin.rainbow.coinsCollected[task] = true;
  client.penguin.coins += 150;
  client.update();
  client.sendXt('rpqcc', task, ItemStatus.Collected, client.penguin.coins);
});

// rainbow puffle quest item collect
handler.xt('rpq#rpqic', (client, task) => {
  client.addItem(RAINBOW_QUEST_REWARDS[Number(task)], { notify: false });
  client.sendXt('rpqic', task, ItemStatus.Collected);
});

// rainbow puffle quest bonus collect
handler.xt('rpq#rpqbc', (client) => {
  // TODO quest can be restarted?
  client.addItem(RAINBOW_BONUS_REWARD);
  client.penguin.rainbow.coinsCollected['bonus'] = true;
  client.update();
})

export default handler;