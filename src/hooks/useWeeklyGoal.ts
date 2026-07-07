import { useEffect, useState } from "react";
import { getGoal, setGoal, entriesThisWeek, currentStreak } from "@/lib/goals";
import { getAllEntries } from "@/lib/db";
import { onEntriesChanged } from "@/lib/events";

const MIN_TARGET = 1;
const MAX_TARGET = 14;

export function useWeeklyGoal() {
  const [target, setTargetState] = useState(3);
  const [done, setDone] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setTargetState(getGoal().target);

    async function refresh() {
      const entries = await getAllEntries();
      const dates = entries.map((e) => e.date);
      setDone(entriesThisWeek(dates));
      setStreak(currentStreak(dates));
    }

    refresh();
    return onEntriesChanged(refresh);
  }, []);

  function updateTarget(n: number) {
    const v = Math.max(MIN_TARGET, Math.min(MAX_TARGET, Math.floor(n) || MIN_TARGET));
    setTargetState(v);
    setGoal({ target: v });
  }

  return {
    target,
    done,
    streak,
    complete: done >= target,
    updateTarget,
    minTarget: MIN_TARGET,
    maxTarget: MAX_TARGET,
  };
}
