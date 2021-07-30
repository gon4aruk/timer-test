import React, { useState } from 'react';
import { interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

const interval$ = interval(1000).pipe(map(val => val + 1));

const Page = () => {
  const [state, setState] = useState(0);
  const [pause, setPause] = useState('pause');
  const [clickTimeout, setClickTimeout] = useState(null);
  const [subscribe, setSubscribe] = useState(null);

  const getCorrectTime = value => (value > 9 ? value : `0${value}`);

  const hours = getCorrectTime(Math.floor(state / 3600));
  const minutes = getCorrectTime(Math.floor((state % 3600) / 60));
  const seconds = getCorrectTime(state % 60);

  const onClickStartStop = () => {
    if (pause === 'pause') {
      const startSub = interval$.subscribe(setState);
      setSubscribe(startSub);
      setPause(false);
      return;
    } else if (pause === 'waiting') {
      const diff = state;
      const resumeSub = interval$.pipe(map(val => val + diff)).subscribe(setState);
      setSubscribe(resumeSub);
      setPause(false);
      return;
    }
    subscribe.unsubscribe();
    setState(0);
    setPause('pause');
  };

  const onClickWait = () => {
    subscribe.unsubscribe();
    setPause('waiting');
  };

  const checkDoubleClick = () => {
    if (!clickTimeout) {
      setClickTimeout(setTimeout(() => setClickTimeout(null), 300));
      return false;
    }
    clearTimeout(clickTimeout);
    setClickTimeout(null);
    setPause(true);
    return true;
  };

  const onClickReset = () => {
    subscribe.unsubscribe();
    const startSub = interval$.pipe(startWith(0)).subscribe(setState);
    setSubscribe(startSub);
  };

  return (
    <div className="timer">
      <div className="timer__title">Timer</div>
      <div className="timer__time">{`${hours}:${minutes}:${seconds}`}</div>
      <div className="active">
        <button className="btn" onClick={onClickStartStop}>
          Start/stop
        </button>
        <button className="btn" onClick={() => (checkDoubleClick() ? onClickWait() : null)}>
          Wait
        </button>
        <button className="btn" onClick={onClickReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Page;
