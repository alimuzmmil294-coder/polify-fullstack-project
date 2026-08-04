import { createContext, useContext, useState } from "react";

const PollContext = createContext();

export function PollProvider({ children }) {
  const [polls, setPolls] = useState([]);

  const setAllPolls = (nextPolls) => {
    setPolls(Array.isArray(nextPolls) ? nextPolls : []);
  };

  // Call this when adding a poll
  const addPoll = (newPoll) => {
    const normalizedPoll = newPoll?.poll || newPoll;
    if (!normalizedPoll) return;

    const normalizedId = normalizedPoll.id || normalizedPoll._id;

    setPolls((prev) => {
      const withoutDuplicate = prev.filter((poll) => (poll.id || poll._id) !== normalizedId);
      return [normalizedPoll, ...withoutDuplicate];
    });
  };

  // Call this when deleting a poll
  const deletePoll = (pollId) => {
    const normalizedId = pollId?.id || pollId?._id || pollId;
    if (!normalizedId) return;

    setPolls((prev) => prev.filter((poll) => (poll.id || poll._id) !== normalizedId));
  };

  return (
    <PollContext.Provider value={{ polls, setAllPolls, addPoll, deletePoll }}>
      {children}
    </PollContext.Provider>
  );
}

export const usePolls = () => useContext(PollContext);
