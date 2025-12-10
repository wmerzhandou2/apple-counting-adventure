
import React, { useState, useEffect } from 'react';
import { Apple } from './components/Apple';
import { OwlGuide } from './components/OwlGuide';
import { PhaseCard } from './components/PhaseCard';
import { AppPhase } from './types';
import { ArrowRight, RotateCcw, CheckCircle2, Search, Wand2, Calculator, Box, ArrowDown, Eye, PauseCircle, Grid3X3, PlusCircle, Utensils, Zap, Repeat, Puzzle, TrainFront, MinusCircle, Hand, Sword, Layers } from 'lucide-react';

// Math Logic:
// Condition 1: Mod 7 = 4 -> Sequence: 4, 11, 18, 25, 32, 39, 46, 53, 60...
// Condition 2: Mod 8 = -4 (or 4) -> Sequence: 4, 12, 20, 28, 36, 44, 52, 60...
// "Missing 4" from a group of 8 means we have 4. (8 - 4 = 4).

export default function App() {
  const [phase, setPhase] = useState<AppPhase>(AppPhase.INTRO);

  // State for Step 7
  const [bags7, setBags7] = useState<number>(0);
  const [sequence7, setSequence7] = useState<number[]>([]);

  // State for Step 8
  const [bags8, setBags8] = useState<number>(0);
  const [sequence8, setSequence8] = useState<number[]>([]);
  const [step8LogicRevealed, setStep8LogicRevealed] = useState<boolean>(false);
  const [step8BagState, setStep8BagState] = useState<'empty' | 'missing' | 'revealed'>('empty');

  // Derived state for comparison
  const [foundMatch, setFoundMatch] = useState<number | null>(null);

  // State for Advanced Phase (Magic/Detective)
  const [magicStep, setMagicStep] = useState<0 | 1 | 2 | 3>(0);
  const [magicVisualState, setMagicVisualState] = useState<'initial' | 'transformed'>('initial');
  const [pocketApples, setPocketApples] = useState<number>(0);

  // State for Surplus Phase (Feeding Bags)
  const [surplusStep, setSurplusStep] = useState<0 | 1 | 2 | 3>(0);
  const [fedBags, setFedBags] = useState<number>(0); // 0 to 4

  // State for Frog Jump Phase (General Method)
  const [frogNum, setFrogNum] = useState<number>(4);
  const [frogHistory, setFrogHistory] = useState<number[]>([]);
  const [frogCheckResult, setFrogCheckResult] = useState<'none' | 'success' | 'fail'>('none');

  // State for Visual Cycle Phase (Block/Train)
  const [cycleStep, setCycleStep] = useState<0 | 1>(0);
  const [cycleLen7, setCycleLen7] = useState<number>(0); // Length of 7-train body
  const [cycleLen8, setCycleLen8] = useState<number>(0); // Length of 8-train body

  // State for Diff Same Method (Constant Difference)
  const [diffStep, setDiffStep] = useState<0 | 1 | 2 | 3>(0);
  const [borrowedApples, setBorrowedApples] = useState<boolean>(false);

  // State for CRT Method (Han Xin)
  const [crtStep, setCrtStep] = useState<0 | 1 | 2 | 3>(0);
  const [crtAgentA, setCrtAgentA] = useState<number>(8); // Initial guess for 8
  const [crtAgentB, setCrtAgentB] = useState<number>(7); // Initial guess for 7
  const [crtCurrentTotal, setCrtCurrentTotal] = useState<number>(0);

  // State for Stacking Method
  const [stackStep, setStackStep] = useState<0 | 1 | 2 | 3>(0);
  const [stackRows, setStackRows] = useState<number>(0);
  const [stackRemainderHidden, setStackRemainderHidden] = useState<boolean>(false);
  const [stackClue2Revealed, setStackClue2Revealed] = useState<boolean>(false);

  const reset = () => {
    setPhase(AppPhase.INTRO);
    setBags7(0);
    setSequence7([]);
    setBags8(0);
    setSequence8([]);
    setStep8LogicRevealed(false);
    setStep8BagState('empty');
    setFoundMatch(null);
    setMagicStep(0);
    setMagicVisualState('initial');
    setPocketApples(0);
    setSurplusStep(0);
    setFedBags(0);
    setFrogNum(4);
    setFrogHistory([]);
    setFrogCheckResult('none');
    setCycleStep(0);
    setCycleLen7(0);
    setCycleLen8(0);
    setDiffStep(0);
    setBorrowedApples(false);
    setCrtStep(0);
    setCrtAgentA(8);
    setCrtAgentB(7);
    setCrtCurrentTotal(0);
    setStackStep(0);
    setStackRows(0);
    setStackRemainderHidden(false);
    setStackClue2Revealed(false);
  };

  const addBag7 = () => {
    const nextBags = bags7 + 1;
    setBags7(nextBags);
    const total = nextBags * 7 + 4;
    setSequence7(prev => [...prev, total]);
  };

  const autoFill7 = () => {
    const targetLen = 9; // Generate up to around 60
    const newSeq: number[] = [];
    for (let i = 1; i <= targetLen; i++) {
      newSeq.push(i * 7 + 4);
    }
    setSequence7(newSeq);
    setBags7(targetLen);
  };

  // Step 8 Logic helpers
  const revealShort4Logic = () => {
    setStep8BagState('missing');
  };

  const revealHave4Logic = () => {
    setStep8BagState('revealed');
    setTimeout(() => {
      setStep8LogicRevealed(true);
    }, 2000);
  };

  const addBag8 = () => {
    const nextBags = bags8 + 1;
    setBags8(nextBags);
    // Logic: Missing 4 means (Total + 4) is divisible by 8.
    // So Total = (Bag * 8) - 4.
    const total = nextBags * 8 - 4;
    setSequence8(prev => [...prev, total]);
  };

  const autoFill8 = () => {
    const targetLen = 8; // Generate up to around 60
    const newSeq: number[] = [];
    for (let i = 1; i <= targetLen; i++) {
      newSeq.push(i * 8 - 4);
    }
    setSequence8(newSeq);
    setBags8(targetLen);
  };

  const checkMatch = (num: number) => {
    if (sequence7.includes(num) && sequence8.includes(num)) {
      setFoundMatch(num);
      setTimeout(() => setPhase(AppPhase.SUCCESS), 1500);
    }
  };

  // Magic Step Helpers
  const transformBagToLeftover = () => {
    setMagicVisualState('transformed');
  };

  const hideApplesToPocket = () => {
    setPocketApples(4);
    setTimeout(() => setMagicStep(2), 1500);
  };

  const returnApplesFromPocket = () => {
    setPocketApples(0);
    setTimeout(() => setMagicStep(3), 500); // Trigger final state visual
  };

  // Surplus Step Helpers
  const feedBags = () => {
    setFedBags(4);
    setTimeout(() => setSurplusStep(2), 2000);
  };

  // Frog Jump Helpers
  const frogJump = () => {
    setFrogCheckResult('none');
    setFrogHistory(prev => [...prev, frogNum]);
    setFrogNum(prev => prev + 7);
  };

  const frogCheck = () => {
    // Condition 2: (Num + 4) % 8 === 0
    if ((frogNum + 4) % 8 === 0) {
      setFrogCheckResult('success');
    } else {
      setFrogCheckResult('fail');
    }
  };

  // Visual Cycle Helpers
  const addTrainBlock = () => {
    // Add to the shorter train to try to catch up
    if (cycleLen7 <= cycleLen8) {
      setCycleLen7(prev => prev + 7);
    } else {
      setCycleLen8(prev => prev + 8);
    }
  };

  // Diff Same Helpers
  const borrowApples = () => {
    setBorrowedApples(true);
    setTimeout(() => setDiffStep(2), 2000);
  };

  const returnBorrowedApples = () => {
    setBorrowedApples(false);
    setTimeout(() => setDiffStep(3), 1000);
  };

  // CRT Helpers
  const nextCrtAgentA = () => {
    setCrtAgentA(prev => prev + 8);
  };

  const nextCrtAgentB = () => {
    setCrtAgentB(prev => prev + 7);
  };

  const assembleArmy = () => {
    // 4 * 8 + 4 * 49 = 32 + 196 = 228
    const total = 4 * 8 + 4 * 49;
    setCrtCurrentTotal(total);
    setCrtStep(3);
  };

  const reduceArmy = () => {
    if (crtCurrentTotal > 60) {
      setCrtCurrentTotal(prev => prev - 56);
    }
  };

  // Stacking Method Helpers
  const revealStackClue2 = () => {
    setStackClue2Revealed(true);
  };

  const hideStackRemainder = () => {
    setStackRemainderHidden(true);
    setTimeout(() => setStackStep(1), 1000);
  };

  const addStackRow = () => {
    const nextRow = stackRows + 1;
    setStackRows(nextRow);
    if (nextRow === 8) {
      setTimeout(() => setStackStep(2), 1000);
    }
  };

  // Render Helpers
  const renderVisualBag = (count: number, type: 7 | 8) => {
    const rows = [];
    // Only show up to 3 bags visually to save space, else just a number
    const displayLimit = 3;

    for (let i = 0; i < Math.min(count, displayLimit); i++) {
      rows.push(
        <div key={i} className="bg-amber-100 border-2 border-amber-300 rounded-xl p-2 m-1 flex flex-wrap w-24 justify-center relative">
          {Array.from({ length: type }).map((_, idx) => {
            // "Missing 4" means we have 4, need 4 more.
            return (
              <Apple key={idx} size="sm" isGhost={type === 8 ? idx >= 4 : false} />
            );
          })}
          <span className="absolute -bottom-3 bg-white text-xs px-1 rounded border border-gray-200 font-bold">
            {type === 8 ? "8差4" : "7"}
          </span>
        </div>
      );
    }

    if (count > displayLimit) {
      rows.push(<div key="more" className="flex items-center justify-center p-2 font-bold text-gray-500 text-xl">+{count - displayLimit} 袋...</div>);
    }
    return rows;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-8 pb-24 sm:pb-32 font-sans">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-4 sm:mb-6 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-red-600 tracking-tight flex items-center gap-1 sm:gap-2">
          <Apple size="lg" /> 数苹果大冒险
        </h1>
        {phase !== AppPhase.INTRO && (
          <button onClick={reset} className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-red-500 transition-colors font-bold text-xs sm:text-sm md:text-base min-h-[44px] px-2">
            <RotateCcw size={16} /> <span className="hidden sm:inline">重新开始</span>
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="space-y-8">

        {/* Intro Phase */}
        {phase === AppPhase.INTRO && (
          <PhaseCard title="奶奶的神秘盒子" color="blue">
            <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
              <p className="text-base sm:text-xl md:text-2xl text-gray-700">
                奶奶寄来了一箱红红的苹果！🍎<br />
                她给了我们<span className="font-bold text-blue-600">两个线索</span>，让我们不用打开箱子就能算出有多少个苹果。
              </p>
              <div className="bg-amber-100 p-4 sm:p-6 rounded-2xl border-dashed border-4 border-amber-400 w-full max-w-md shadow-sm">
                <ul className="text-left space-y-3 sm:space-y-4 text-base sm:text-lg font-medium text-amber-900">
                  <li className="flex items-center gap-2 sm:gap-3">
                    <span className="bg-blue-500 text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm sm:text-base">1</span>
                    每 <b>7</b> 个装一袋，还多 <b>4</b> 个。
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <span className="bg-purple-500 text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm sm:text-base">2</span>
                    每 <b>8</b> 个装一袋，又差 <b>4</b> 个。
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setPhase(AppPhase.STEP_7)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-base sm:text-xl px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold shadow-lg transform transition hover:scale-105 active:scale-95 flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center"
              >
                解开第 1 个线索 <ArrowRight size={20} />
              </button>
            </div>
          </PhaseCard>
        )}

        {/* Step 7 Phase */}
        {phase === AppPhase.STEP_7 && (
          <PhaseCard title="线索 1：每袋装 7 个" color="green">
            <div className="space-y-4 sm:space-y-6">
              <p className="text-center text-sm sm:text-lg text-gray-700">
                "每 7 个装一袋，<span className="font-bold text-red-500">还多 4 个</span>。"
                <br />就是说：把苹果装进袋子里，最后手里还剩 4 个。
              </p>

              <div className="flex flex-col gap-4 sm:gap-6">
                {/* Visualizer */}
                <div className="w-full bg-white rounded-xl p-3 sm:p-4 shadow-inner min-h-[160px] sm:min-h-[220px] flex flex-col items-center border border-gray-100">
                  <div className="flex flex-wrap justify-center items-end gap-1 sm:gap-2 mb-3 sm:mb-4">
                    {renderVisualBag(bags7, 7)}
                    {/* The remainder */}
                    <div className="bg-red-50 border-2 border-red-300 rounded-xl p-1.5 sm:p-2 m-1 flex flex-wrap w-14 sm:w-16 justify-center shadow-sm">
                      {[1, 2, 3, 4].map(i => <Apple key={i} size="sm" />)}
                      <span className="text-xs font-bold text-red-500 mt-1">剩 4 个</span>
                    </div>
                  </div>
                  <div className="text-base sm:text-xl md:text-2xl font-bold text-gray-700 mt-auto bg-gray-50 px-3 sm:px-4 py-2 rounded-full text-center">
                    {bags7} 袋 × 7 + 4 = <span className="text-green-600 text-xl sm:text-3xl md:text-4xl">{bags7 * 7 + 4}</span>
                  </div>
                </div>

                {/* Controls & List */}
                <div className="w-full space-y-3 sm:space-y-4">
                  <div className="flex gap-2 justify-center flex-wrap">
                    <button
                      onClick={addBag7}
                      className="bg-green-500 hover:bg-green-600 text-white px-5 sm:px-6 py-3 rounded-xl font-bold shadow-md active:scale-95 transition text-sm sm:text-base"
                    >
                      + 加一袋
                    </button>
                    {sequence7.length > 3 && (
                      <button onClick={autoFill7} className="text-green-600 font-bold hover:underline px-3 sm:px-4 bg-green-50 rounded-xl text-sm sm:text-base">
                        自动填充...
                      </button>
                    )}
                  </div>

                  <div className="bg-gray-100 p-3 sm:p-4 rounded-xl shadow-inner">
                    <h3 className="font-bold text-gray-500 uppercase text-xs mb-2">可能的苹果数量：</h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {sequence7.map((num, i) => (
                        <div key={i} className="bg-white px-2 sm:px-3 py-1 rounded-lg shadow-sm text-green-700 font-bold border border-green-200 text-sm sm:text-base">
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>

                  {sequence7.length > 5 && (
                    <div className="text-center pt-2">
                      <button
                        onClick={() => setPhase(AppPhase.STEP_8)}
                        className="bg-gray-800 hover:bg-black text-white px-6 sm:px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 mx-auto transform transition hover:scale-105 active:scale-95 w-full sm:w-auto justify-center text-sm sm:text-base"
                      >
                        好啦，看第 2 个线索 <ArrowRight size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </PhaseCard>
        )}

        {/* Step 8 Phase */}
        {phase === AppPhase.STEP_8 && (
          <PhaseCard title="线索 2：每袋装 8 个" color="purple">
            <div className="space-y-6">
              <div className="bg-purple-100 p-4 rounded-xl text-center border border-purple-200">
                <p className="text-lg text-purple-900 font-medium">
                  “每 8 个装一袋，<span className="font-bold text-red-600">又差 4 个</span>。”
                </p>
                <div className="mt-2 text-sm text-purple-700">
                  “差4个”到底是什么意思呢？我们来看看箱子里面！
                </div>
              </div>

              {/* Logic Revealer Section */}
              {!step8LogicRevealed && (
                <div className="bg-white border-4 border-dashed border-purple-300 rounded-3xl p-8 max-w-lg mx-auto text-center animate-in fade-in">
                  <h3 className="text-xl font-bold text-gray-600 mb-6">假装我们有一个能装8个苹果的袋子...</h3>

                  <div className="flex justify-center gap-2 mb-8 bg-amber-50 p-4 rounded-xl inline-flex mx-auto border border-amber-200">
                    {/* First 4 slots */}
                    <div className="flex gap-1">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={`exist-${i}`} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${step8BagState === 'revealed' ? 'scale-100' : 'scale-90'}`}>
                          {step8BagState === 'revealed' ? (
                            <Apple size="lg" className="animate-bounce-slight" style={{ animationDelay: `${i * 0.1}s` }} />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-gray-300 font-bold">?</div>
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Separator */}
                    <div className="w-1 h-12 bg-amber-200/50 rounded-full mx-1"></div>
                    {/* Last 4 slots */}
                    <div className="flex gap-1">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={`miss-${i}`} className={`w-12 h-12 rounded-full border-2 border-dashed border-red-300 bg-red-50 flex items-center justify-center transition-all duration-500 ${step8BagState !== 'empty' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                          <span className="text-xs text-red-400 font-bold">缺</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {step8BagState === 'empty' && (
                      <button onClick={revealShort4Logic} className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg animate-pulse">
                        点击这里：什么是“差4个”？
                      </button>
                    )}

                    {step8BagState === 'missing' && (
                      <div className="animate-in slide-in-from-bottom">
                        <p className="text-lg text-gray-700 mb-4 font-bold">
                          看！这4个位置是空的（缺4个）。<br />
                          那袋子里<span className="text-green-600">其实有几个苹果</span>？
                        </p>
                        <button onClick={revealHave4Logic} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg">
                          我看出来了！里面有...
                        </button>
                      </div>
                    )}

                    {step8BagState === 'revealed' && (
                      <div className="animate-in zoom-in">
                        <p className="text-2xl font-black text-purple-600 mb-2">4 个！</p>
                        <p className="text-gray-500 text-sm">
                          原来“差 4 个”和“剩 4 个”是一回事！<br />
                          (8 减去缺的 4 = 剩下的 4)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Main Logic Area - Only visible after understanding logic */}
              {step8LogicRevealed && (
                <div className="flex flex-col md:flex-row gap-8 items-start animate-in fade-in slide-in-from-bottom">
                  {/* Visualizer */}
                  <div className="flex-1 w-full bg-white rounded-xl p-4 shadow-inner min-h-[220px] flex flex-col items-center border border-gray-100">
                    <div className="flex flex-wrap justify-center items-end gap-2 mb-4">
                      {Array.from({ length: Math.max(0, bags8 - 1) }).map((_, i) => (
                        <div key={i} className="bg-amber-100 border-2 border-amber-300 rounded-xl p-2 w-24 flex flex-wrap justify-center">
                          {Array.from({ length: 8 }).map((_, j) => <Apple key={j} size="sm" />)}
                        </div>
                      ))}

                      {bags8 > 0 && (
                        <div className="bg-amber-50 border-2 border-dashed border-purple-300 rounded-xl p-2 w-24 flex flex-wrap justify-center relative">
                          <div className="absolute -top-3 text-xs bg-purple-100 text-purple-700 px-1 rounded font-bold whitespace-nowrap">还差 4 个</div>
                          {/* 4 Real */}
                          <Apple size="sm" /> <Apple size="sm" /> <Apple size="sm" /> <Apple size="sm" />
                          {/* 4 Ghost */}
                          <Apple size="sm" isGhost /> <Apple size="sm" isGhost /> <Apple size="sm" isGhost /> <Apple size="sm" isGhost />
                        </div>
                      )}
                    </div>
                    {bags8 > 0 && (
                      <div className="text-xl md:text-2xl font-bold text-gray-700 mt-auto bg-gray-50 px-4 py-2 rounded-full">
                        {bags8} 袋 × 8 - 4 = <span className="text-purple-600 text-3xl md:text-4xl">{bags8 * 8 - 4}</span>
                      </div>
                    )}
                  </div>

                  {/* Controls & List */}
                  <div className="flex-1 w-full space-y-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={addBag8}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-md active:scale-95 transition"
                      >
                        + 加一袋 (8个)
                      </button>
                      {sequence8.length > 3 && (
                        <button onClick={autoFill8} className="text-purple-600 font-bold hover:underline px-4 bg-purple-50 rounded-xl">
                          自动填充...
                        </button>
                      )}
                    </div>

                    <div className="bg-gray-100 p-4 rounded-xl shadow-inner">
                      <h3 className="font-bold text-gray-500 uppercase text-xs mb-2">可能的苹果数量：</h3>
                      <div className="flex flex-wrap gap-2">
                        {sequence8.map((num, i) => (
                          <div key={i} className="bg-white px-3 py-1 rounded-lg shadow-sm text-purple-700 font-bold border border-purple-200 animate-bounce-slight" style={{ animationDelay: `${i * 0.1}s` }}>
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>

                    {sequence8.length > 5 && (
                      <div className="text-center pt-2">
                        <button
                          onClick={() => setPhase(AppPhase.COMPARE)}
                          className="bg-gray-800 hover:bg-black text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 mx-auto transform transition hover:scale-105"
                        >
                          让我们来找找看！ <Search size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </PhaseCard>
        )}

        {/* Compare Phase */}
        {phase === AppPhase.COMPARE && (
          <PhaseCard title="寻找神奇的数字" color="orange">
            <div className="text-center space-y-4 sm:space-y-6">
              <p className="text-base sm:text-xl text-gray-700">
                正确的苹果数量必须<span className="font-bold text-green-600">同时</span>出现在两个清单里。
                <br />你能找到它吗？点一点那个数字！
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-8 max-w-3xl mx-auto">
                <div className="bg-green-50 p-3 sm:p-4 rounded-xl border-2 border-green-200">
                  <h3 className="text-green-700 font-bold mb-3 sm:mb-4 text-sm sm:text-base">线索 1 的数字</h3>
                  <div className="flex flex-wrap sm:flex-col gap-2 justify-center">
                    {sequence7.map(num => (
                      <button
                        key={`s7-${num}`}
                        onClick={() => checkMatch(num)}
                        className={`py-2 px-3 sm:px-4 rounded-lg font-bold text-sm sm:text-lg transition-all min-w-[48px] ${foundMatch === num
                          ? 'bg-yellow-400 text-white scale-110 shadow-xl ring-4 ring-yellow-200'
                          : 'bg-white text-green-700 hover:bg-green-100 shadow-sm active:scale-95'
                          }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50 p-3 sm:p-4 rounded-xl border-2 border-purple-200">
                  <h3 className="text-purple-700 font-bold mb-3 sm:mb-4 text-sm sm:text-base">线索 2 的数字</h3>
                  <div className="flex flex-wrap sm:flex-col gap-2 justify-center">
                    {sequence8.map(num => (
                      <button
                        key={`s8-${num}`}
                        onClick={() => checkMatch(num)}
                        className={`py-2 px-3 sm:px-4 rounded-lg font-bold text-sm sm:text-lg transition-all min-w-[48px] ${foundMatch === num
                          ? 'bg-yellow-400 text-white scale-110 shadow-xl ring-4 ring-yellow-200'
                          : 'bg-white text-purple-700 hover:bg-purple-100 shadow-sm active:scale-95'
                          }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </PhaseCard>
        )}

        {/* Success Phase */}
        {phase === AppPhase.SUCCESS && (
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 pb-20">
            <div className="inline-block p-4 sm:p-8 bg-yellow-100 rounded-full border-4 sm:border-8 border-yellow-300 shadow-2xl">
              <Apple size="xl" className="w-20 h-20 sm:w-32 sm:h-32" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
              60 个苹果！
            </h1>
            <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl max-w-lg mx-auto border-4 border-yellow-200">
              <div className="flex items-center gap-3 sm:gap-4 text-left border-b border-gray-100 pb-3 sm:pb-4 mb-3 sm:mb-4">
                <CheckCircle2 className="text-green-500 w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm font-bold">验算 1</p>
                  <p className="text-base sm:text-xl font-bold text-gray-800">60个分7堆 = 8袋, 剩4个</p>
                  <p className="text-green-600 text-sm sm:text-base">符合"还多 4 个"！</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 text-left">
                <CheckCircle2 className="text-purple-500 w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm font-bold">验算 2</p>
                  <p className="text-base sm:text-xl font-bold text-gray-800">60 + 4 = 64 (8个装8袋)</p>
                  <p className="text-purple-600 text-sm sm:text-base">符合"还差 4 个"！</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-4">
              <button onClick={reset} className="bg-gray-200 text-gray-700 font-bold py-2 sm:py-3 px-4 sm:px-8 rounded-full shadow hover:bg-gray-300 transition text-sm sm:text-base active:scale-95 col-span-2 sm:col-span-1">
                再玩一次
              </button>
              <button
                onClick={() => setPhase(AppPhase.ADVANCED_EXPLAIN)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 sm:py-3 px-3 sm:px-8 rounded-full shadow-lg transition flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base active:scale-95"
              >
                <Wand2 size={16} /> <span className="hidden sm:inline">学个</span>"魔法侦探法"
              </button>
              <button
                onClick={() => setPhase(AppPhase.SURPLUS_METHOD)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 sm:py-3 px-3 sm:px-8 rounded-full shadow-lg transition flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base active:scale-95"
              >
                <Utensils size={16} /> <span className="hidden sm:inline">学一招</span>"填坑法"
              </button>
              <button
                onClick={() => setPhase(AppPhase.GENERAL_FROG)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 px-3 sm:px-8 rounded-full shadow-lg transition flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base active:scale-95"
              >
                <Repeat size={16} /> <span className="hidden sm:inline">学一招</span>"青蛙跳跳法"
              </button>
              <button
                onClick={() => setPhase(AppPhase.VISUAL_CYCLE)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 px-3 sm:px-8 rounded-full shadow-lg transition flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base active:scale-95"
              >
                <TrainFront size={16} /> <span className="hidden sm:inline">学一招</span>"积木周期法"
              </button>
              <button
                onClick={() => setPhase(AppPhase.DIFF_SAME_METHOD)}
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 sm:py-3 px-3 sm:px-8 rounded-full shadow-lg transition flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base active:scale-95"
              >
                <MinusCircle size={16} /> <span className="hidden sm:inline">学一招</span>"差同减差"
              </button>
              <button
                onClick={() => setPhase(AppPhase.CRT_METHOD)}
                className="bg-indigo-800 hover:bg-indigo-900 text-white font-bold py-2 sm:py-3 px-3 sm:px-8 rounded-full shadow-lg transition flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base active:scale-95"
              >
                <Sword size={16} /> <span className="hidden sm:inline">学一招</span>"韩信点兵"
              </button>
              <button
                onClick={() => setPhase(AppPhase.STACKING_METHOD)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 sm:py-3 px-3 sm:px-8 rounded-full shadow-lg transition flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base active:scale-95"
              >
                <Layers size={16} /> <span className="hidden sm:inline">学一招</span>"层层堆叠法"
              </button>
            </div>
          </div>
        )}

        {/* Stacking Method Phase */}
        {phase === AppPhase.STACKING_METHOD && (
          <PhaseCard title="层层堆叠法：砌墙游戏" color="teal">
            <div className="flex flex-col items-center min-h-[500px] justify-start py-4">

              {/* Step 0: Isolate the 4 */}
              {stackStep === 0 && (
                <div className="animate-in fade-in max-w-2xl w-full text-center">
                  <h3 className="text-2xl font-bold text-teal-900 mb-6">第一步：先把 4 个放一边</h3>
                  <div className="flex flex-col md:flex-row justify-center gap-8 mb-8 items-center md:items-stretch">
                    {/* Clue 1 */}
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200 w-full md:w-48">
                      <p className="text-green-700 font-bold mb-2">一包装 7 个</p>
                      <p className="text-red-500 font-bold text-lg">多 4 个</p>
                      <div className="mt-4 flex justify-center gap-1">
                        <Apple size="md" /> <Apple size="md" /> <Apple size="md" /> <Apple size="md" />
                      </div>
                    </div>

                    {/* Clue 2 Interactive */}
                    <div
                      className={`p-4 rounded-xl border-2 transition-all duration-300 w-full md:w-56 cursor-pointer ${stackClue2Revealed ? 'bg-green-50 border-green-300' : 'bg-purple-50 border-purple-300 border-dashed hover:scale-105'}`}
                      onClick={revealStackClue2}
                    >
                      <p className="text-purple-700 font-bold mb-2">
                        一包装 8 个
                        {!stackClue2Revealed && <span className="text-xs ml-1">(点我)</span>}
                      </p>
                      {stackClue2Revealed ? (
                        <div className="animate-in zoom-in">
                          <p className="text-green-600 font-bold text-lg">其实是有 4 个！</p>
                          <div className="mt-4 flex justify-center gap-1">
                            <Apple size="md" /> <Apple size="md" /> <Apple size="md" /> <Apple size="md" />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-purple-500 font-bold text-lg">少 4 个</p>
                          <div className="mt-4 flex justify-center gap-1 opacity-50">
                            <div className="w-8 h-8 rounded-full border-2 border-dashed border-red-300 bg-red-50 flex items-center justify-center text-xs text-red-300">缺</div>
                            <div className="w-8 h-8 rounded-full border-2 border-dashed border-red-300 bg-red-50 flex items-center justify-center text-xs text-red-300">缺</div>
                            <div className="w-8 h-8 rounded-full border-2 border-dashed border-red-300 bg-red-50 flex items-center justify-center text-xs text-red-300">缺</div>
                            <div className="w-8 h-8 rounded-full border-2 border-dashed border-red-300 bg-red-50 flex items-center justify-center text-xs text-red-300">缺</div>
                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold">?</div>
                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold">?</div>
                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold">?</div>
                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold">?</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {stackClue2Revealed && (
                    <div className="animate-in slide-in-from-bottom">
                      <div className="relative h-32 flex justify-center items-center mb-4">
                        <div className={`flex gap-2 transition-all duration-1000 ${stackRemainderHidden ? 'translate-x-[200px] scale-75 opacity-50' : ''}`}>
                          {[1, 2, 3, 4].map(i => <Apple key={i} size="lg" className="animate-bounce-slight" style={{ animationDelay: `${i * 0.1}s` }} />)}
                        </div>
                        {stackRemainderHidden && (
                          <div className="absolute right-0 top-10 text-xs text-gray-400 font-bold bg-white px-2 rounded border border-gray-200">
                            暂存区
                          </div>
                        )}
                      </div>

                      {!stackRemainderHidden && (
                        <div>
                          <p className="text-gray-600 mb-4 font-bold">既然两边都“多 4 个”，我们先把它们放一边！</p>
                          <button onClick={hideStackRemainder} className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-bold shadow-lg animate-pulse">
                            把它们移开 👉
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 1: Stack Rows */}
              {stackStep >= 1 && (
                <div className="w-full max-w-4xl animate-in fade-in">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-teal-900 mb-2">第二步：寻找“完美矩形”</h3>
                    <p className="text-gray-600 max-w-xl mx-auto">
                      我们现在每层有 7 个。但必须凑够总数，让 8 个人也能平分。<br />
                      <span className="text-teal-600 font-bold">我们加一层试一次，看看总数能不能被 8 整除！</span>
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 justify-center items-end min-h-[400px]">
                    {/* The Stacking Container */}
                    <div className="bg-white p-4 rounded-b-2xl border-4 border-t-0 border-teal-200 shadow-xl w-64 relative min-h-[350px] flex flex-col justify-end">
                      {Array.from({ length: stackRows }).map((_, rIndex) => (
                        <div key={rIndex} className="flex justify-center gap-1 mb-1 animate-in slide-in-from-top fade-in">
                          {Array.from({ length: 7 }).map((_, cIndex) => (
                            <div key={cIndex} className="w-6 h-6 bg-green-400 rounded-sm shadow-sm"></div>
                          ))}
                          <span className="absolute left-2 text-xs text-gray-300 font-mono">Row {rIndex + 1}</span>
                        </div>
                      ))}
                      {stackRows < 8 && (
                        <div className="absolute top-10 left-0 right-0 text-center text-gray-300 font-bold border-2 border-dashed border-gray-200 mx-4 py-8 rounded-xl">
                          堆到这里
                        </div>
                      )}
                      <div className="border-t-2 border-gray-100 mt-2 pt-2 text-center text-teal-600 font-bold">
                        总共: {stackRows * 7} 个
                      </div>
                    </div>

                    {/* Validation Panel */}
                    <div className="flex flex-col gap-4 w-64">
                      <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                        <p className="text-purple-800 font-bold mb-2">能分给 8 个人吗？</p>
                        <p className="font-mono text-xl">
                          {stackRows * 7} ÷ 8 = ?
                        </p>
                        {stackRows > 0 && (
                          <p className={`mt-2 font-bold ${stackRows === 8 ? 'text-green-600 text-2xl animate-bounce' : 'text-red-400'}`}>
                            {stackRows === 8 ? '✅ 可以！(正好56)' : '❌ 不行，有余数'}
                          </p>
                        )}
                      </div>

                      {stackRows < 8 ? (
                        <button onClick={addStackRow} className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
                          <PlusCircle /> 加一行 (现在 {stackRows * 7})
                        </button>
                      ) : (
                        <div className="animate-in zoom-in">
                          <p className="text-teal-700 font-bold mb-2 text-center">成功啦！</p>
                          <p className="text-xs text-gray-500 text-center">56 既是 7 的倍数，也是 8 的倍数</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Final Result */}
              {stackStep === 2 && (
                <div className="mt-8 bg-white p-8 rounded-3xl shadow-2xl border-4 border-teal-300 text-center animate-in slide-in-from-bottom max-w-lg">
                  <h3 className="text-xl font-bold text-gray-500 mb-4 uppercase">最终计算</h3>
                  <div className="flex items-center justify-center gap-4 text-3xl md:text-5xl font-black text-gray-800">
                    <span className="text-green-500">56</span>
                    <span>+</span>
                    <div className="relative">
                      <span className="text-red-500">4</span>
                      <span className="absolute -top-4 left-0 right-0 text-xs text-gray-400 font-normal">暂存</span>
                    </div>
                    <span>=</span>
                    <span className="text-teal-600">60</span>
                  </div>
                  <button onClick={reset} className="mt-8 bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 mx-auto">
                    <RotateCcw size={14} /> 再玩一次
                  </button>
                </div>
              )}

            </div>
          </PhaseCard>
        )}

        {/* Surplus Method Phase (填坑法) */}
        {phase === AppPhase.SURPLUS_METHOD && (
          <PhaseCard title="填坑法：喂饱袋子" color="orange">
            <div className="flex flex-col items-center min-h-[500px] justify-start py-4">

              {/* Step 0: Introduction */}
              {surplusStep === 0 && (
                <div className="animate-in fade-in max-w-2xl w-full text-center">
                  <h3 className="text-2xl font-bold text-orange-900 mb-6">第一步：理解喂袋子</h3>
                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 mb-6">
                    <p className="text-orange-800 text-lg mb-4">
                      现在每袋有 <span className="font-bold text-green-600">7 个</span> 苹果，
                      如果要变成 <span className="font-bold text-purple-600">8 个</span>...
                    </p>
                    <p className="text-orange-700 font-bold text-xl">
                      每个袋子需要"多吃" <span className="text-red-500 text-3xl">1</span> 个苹果！
                    </p>
                  </div>
                  <button
                    onClick={() => setSurplusStep(1)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg"
                  >
                    我明白了，继续！ <ArrowRight className="inline" />
                  </button>
                </div>
              )}

              {/* Step 1: Feed bags */}
              {surplusStep === 1 && (
                <div className="animate-in fade-in max-w-2xl w-full text-center">
                  <h3 className="text-2xl font-bold text-orange-900 mb-6">第二步：用多余的苹果喂袋子</h3>
                  <p className="text-gray-600 mb-6">我们手里有 <span className="font-bold text-red-500">4 个多余的苹果</span>。把它们分给袋子们！</p>

                  <div className="flex justify-center gap-4 mb-8 flex-wrap">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`w-20 h-20 rounded-xl border-4 flex items-center justify-center transition-all duration-500 ${fedBags >= i ? 'bg-green-100 border-green-400' : 'bg-gray-100 border-gray-300 border-dashed'
                        }`}>
                        {fedBags >= i ? (
                          <div className="text-center">
                            <span className="text-2xl">😋</span>
                            <p className="text-xs text-green-600 font-bold">吃饱了</p>
                          </div>
                        ) : (
                          <span className="text-gray-400">🍽️</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {fedBags === 0 ? (
                    <button onClick={feedBags} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg animate-pulse">
                      喂给袋子们吃！
                    </button>
                  ) : (
                    <p className="text-green-600 font-bold text-lg animate-in zoom-in">喂饱了 4 个袋子！</p>
                  )}
                </div>
              )}

              {/* Step 2: Count empty slots */}
              {surplusStep === 2 && (
                <div className="animate-in fade-in max-w-2xl w-full text-center">
                  <h3 className="text-2xl font-bold text-orange-900 mb-6">第三步：还有几个袋子饿着？</h3>
                  <p className="text-gray-600 mb-6">题目说"差 4 个"，意味着还有 4 个空位没填满！</p>

                  <div className="flex justify-center gap-4 mb-8 flex-wrap">
                    {/* Fed bags */}
                    {[1, 2, 3, 4].map(i => (
                      <div key={`fed-${i}`} className="w-16 h-16 rounded-xl bg-green-100 border-2 border-green-400 flex items-center justify-center">
                        <span className="text-xl">😋</span>
                      </div>
                    ))}
                    {/* Hungry bags */}
                    {[1, 2, 3, 4].map(i => (
                      <div key={`hungry-${i}`} className="w-16 h-16 rounded-xl bg-red-50 border-2 border-red-300 border-dashed flex items-center justify-center animate-pulse">
                        <span className="text-xl">😢</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => setSurplusStep(3)} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg">
                    算出总数！ <ArrowRight className="inline" />
                  </button>
                </div>
              )}

              {/* Step 3: Final calculation */}
              {surplusStep === 3 && (
                <div className="animate-in zoom-in max-w-lg w-full text-center bg-white p-8 rounded-3xl shadow-2xl border-4 border-orange-200">
                  <h3 className="text-xl font-bold text-gray-500 mb-4 uppercase">破案了！</h3>
                  <div className="text-2xl font-bold text-gray-700 mb-4">
                    <span className="text-green-500">4 个吃饱的</span> + <span className="text-red-500">4 个饿着的</span> = <span className="text-orange-600 text-4xl">8 个袋子</span>
                  </div>
                  <div className="text-3xl font-black text-gray-800 mb-6">
                    8 袋 × 7 个 + 4 个 = <span className="text-orange-600 text-5xl">60</span> 个苹果
                  </div>
                  <button onClick={reset} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 mx-auto">
                    <RotateCcw size={14} /> 再玩一次
                  </button>
                </div>
              )}
            </div>
          </PhaseCard>
        )}

        {/* General Frog Jump Phase (青蛙跳跳法) */}
        {phase === AppPhase.GENERAL_FROG && (
          <PhaseCard title="青蛙跳跳法：万能试探" color="green">
            <div className="flex flex-col items-center min-h-[500px] justify-start py-4">
              <div className="max-w-2xl w-full">
                <div className="bg-green-50 p-4 rounded-xl border border-green-200 mb-6 text-center">
                  <p className="text-green-800">
                    规则：从 <span className="font-bold">4</span> 开始（多的4个），每次跳 <span className="font-bold">+7</span>，
                    <br />直到找到一个数，加上4后能被8整除！
                  </p>
                </div>

                {/* Frog Visual */}
                <div className="relative bg-white rounded-2xl p-6 shadow-xl border-2 border-green-100 mb-6">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <span className="text-6xl">🐸</span>
                    <div className="text-center">
                      <p className="text-gray-500 text-sm">当前位置</p>
                      <p className="text-5xl font-black text-green-600">{frogNum}</p>
                    </div>
                  </div>

                  {/* History trail */}
                  {frogHistory.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 border-t border-gray-100 pt-4">
                      {frogHistory.map((n, i) => (
                        <span key={i} className="text-gray-400 text-sm">{n} →</span>
                      ))}
                      <span className="text-green-600 font-bold">{frogNum}</span>
                    </div>
                  )}
                </div>

                {/* Check result */}
                {frogCheckResult !== 'none' && (
                  <div className={`mb-4 p-4 rounded-xl text-center font-bold animate-in zoom-in ${frogCheckResult === 'success' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-50 text-red-600'
                    }`}>
                    {frogCheckResult === 'success' ? (
                      <div>
                        <p className="text-2xl mb-2">🎉 找到了！</p>
                        <p>{frogNum} + 4 = {frogNum + 4}，正好能被8整除！</p>
                      </div>
                    ) : (
                      <p>❌ {frogNum} + 4 = {frogNum + 4}，除以8有余数，继续跳！</p>
                    )}
                  </div>
                )}

                {/* Controls */}
                <div className="flex justify-center gap-4 flex-wrap">
                  {frogCheckResult !== 'success' && (
                    <>
                      <button
                        onClick={frogJump}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-md flex items-center gap-2"
                      >
                        <Repeat size={20} /> 跳！(+7)
                      </button>
                      <button
                        onClick={frogCheck}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-md flex items-center gap-2"
                      >
                        <Calculator size={20} /> 检查
                      </button>
                    </>
                  )}
                  {frogCheckResult === 'success' && (
                    <button onClick={reset} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-2 rounded-full font-bold flex items-center gap-2">
                      <RotateCcw size={14} /> 再玩一次
                    </button>
                  )}
                </div>
              </div>
            </div>
          </PhaseCard>
        )}

        {/* Visual Cycle Phase (积木周期法) */}
        {phase === AppPhase.VISUAL_CYCLE && (
          <PhaseCard title="积木周期法：火车拼接" color="blue">
            <div className="flex flex-col items-center min-h-[500px] justify-start py-4">

              {/* Step 0: Find the head */}
              {cycleStep === 0 && (
                <div className="animate-in fade-in max-w-2xl w-full text-center">
                  <h3 className="text-2xl font-bold text-blue-900 mb-6">第一步：找"火车头"</h3>
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-6">
                    <p className="text-blue-800 text-lg mb-4">
                      两个线索都有"4"这个数字：
                    </p>
                    <div className="flex justify-center gap-4 mb-4">
                      <div className="bg-green-100 px-4 py-2 rounded-lg">7个一袋 <span className="font-bold text-red-500">多4个</span></div>
                      <div className="bg-purple-100 px-4 py-2 rounded-lg">8个一袋 <span className="font-bold text-red-500">差4个</span> = 有4个</div>
                    </div>
                    <p className="text-blue-700 font-bold text-xl">
                      火车头就是 <span className="text-3xl text-blue-600">4</span>！
                    </p>
                  </div>
                  <button
                    onClick={() => setCycleStep(1)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg"
                  >
                    开始拼火车！ <ArrowRight className="inline" />
                  </button>
                </div>
              )}

              {/* Step 1: Build trains */}
              {cycleStep === 1 && (
                <div className="animate-in fade-in max-w-3xl w-full">
                  <h3 className="text-xl font-bold text-blue-900 mb-4 text-center">第二步：拼接车厢直到对齐</h3>
                  <p className="text-center text-gray-600 mb-6">
                    蓝色车厢长7，紫色车厢长8。不断加车厢，直到两列火车一样长！
                  </p>

                  <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-blue-100 mb-6">
                    {/* Train 7 */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                        <div
                          className="h-8 bg-blue-400 rounded-r-lg transition-all duration-300"
                          style={{ width: `${cycleLen7 * 8}px` }}
                        ></div>
                        <span className="text-blue-600 font-bold">= {4 + cycleLen7}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">7列车: 4 + {cycleLen7}</p>
                    </div>

                    {/* Train 8 */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                        <div
                          className="h-8 bg-purple-400 rounded-r-lg transition-all duration-300"
                          style={{ width: `${cycleLen8 * 8}px` }}
                        ></div>
                        <span className="text-purple-600 font-bold">= {4 + cycleLen8}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">8列车: 4 + {cycleLen8}</p>
                    </div>

                    {/* Match indicator */}
                    {cycleLen7 === cycleLen8 && cycleLen7 > 0 && (4 + cycleLen7) === 60 && (
                      <div className="bg-yellow-100 p-4 rounded-xl text-center animate-in zoom-in">
                        <p className="text-2xl font-black text-yellow-800">🎉 对齐了！答案是 {4 + cycleLen7}！</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center gap-4">
                    {!((4 + cycleLen7) === 60 && cycleLen7 === cycleLen8) ? (
                      <button
                        onClick={addTrainBlock}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-md flex items-center gap-2"
                      >
                        <TrainFront size={20} /> 加一节车厢
                      </button>
                    ) : (
                      <button onClick={reset} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-2 rounded-full font-bold flex items-center gap-2">
                        <RotateCcw size={14} /> 再玩一次
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </PhaseCard>
        )}

        {/* Diff Same Method Phase (差同减差法) */}
        {phase === AppPhase.DIFF_SAME_METHOD && (
          <PhaseCard title="差同减差法：借苹果魔法" color="pink">
            <div className="flex flex-col items-center min-h-[500px] justify-start py-4">

              {/* Step 0: Introduction */}
              {diffStep === 0 && (
                <div className="animate-in fade-in max-w-2xl w-full text-center">
                  <h3 className="text-2xl font-bold text-pink-900 mb-6">学习口诀："差同减差"</h3>
                  <div className="bg-pink-50 p-6 rounded-xl border border-pink-200 mb-6">
                    <p className="text-pink-800 text-lg mb-4">
                      我们用一个<span className="font-bold">新例子</span>来学习：
                    </p>
                    <div className="flex flex-col gap-2 text-left max-w-xs mx-auto">
                      <div className="bg-white px-4 py-2 rounded-lg border">7个一袋，<span className="font-bold text-red-500">差3个</span></div>
                      <div className="bg-white px-4 py-2 rounded-lg border">8个一袋，<span className="font-bold text-red-500">差3个</span></div>
                    </div>
                    <p className="text-pink-700 font-bold text-lg mt-4">
                      都缺3个！这叫"<span className="text-pink-600">差同</span>"！
                    </p>
                  </div>
                  <button
                    onClick={() => setDiffStep(1)}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-bold shadow-lg"
                  >
                    开始施法！ <Wand2 className="inline" size={20} />
                  </button>
                </div>
              )}

              {/* Step 1: Borrow apples */}
              {diffStep === 1 && (
                <div className="animate-in fade-in max-w-2xl w-full text-center">
                  <h3 className="text-2xl font-bold text-pink-900 mb-6">第二步：借苹果填满</h3>
                  <p className="text-gray-600 mb-6">既然都缺3个，我们就"借"3个苹果来把空位填满！</p>

                  <div className="flex justify-center gap-4 mb-8">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${borrowedApples ? 'bg-yellow-100 border-4 border-yellow-400 scale-110' : 'bg-gray-100 border-2 border-dashed border-gray-300'
                        }`}>
                        {borrowedApples ? <Apple size="lg" /> : <span className="text-gray-400">?</span>}
                      </div>
                    ))}
                  </div>

                  {!borrowedApples ? (
                    <button onClick={borrowApples} className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-bold shadow-lg animate-pulse">
                      借来3个苹果！ <Hand className="inline" size={20} />
                    </button>
                  ) : (
                    <p className="text-pink-600 font-bold text-lg">借来了3个苹果！空位填满了！</p>
                  )}
                </div>
              )}

              {/* Step 2: Perfect rectangle */}
              {diffStep === 2 && (
                <div className="animate-in fade-in max-w-2xl w-full text-center">
                  <h3 className="text-2xl font-bold text-pink-900 mb-6">第三步：完美矩形</h3>
                  <p className="text-gray-600 mb-6">填满后，苹果能被7和8同时整除 → 就是 7×8 = 56！</p>

                  <div className="bg-white p-6 rounded-2xl shadow-xl border-4 border-pink-200 mb-6 inline-block">
                    <div className="grid grid-cols-8 gap-1">
                      {Array.from({ length: 56 }).map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-pink-400 rounded-sm"></div>
                      ))}
                    </div>
                    <p className="text-center mt-4 text-pink-600 font-bold text-xl">7 × 8 = 56</p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mb-6">
                    <p className="text-yellow-800">⚠️ 但是！这3个苹果是借来的，要还回去！</p>
                  </div>

                  <button onClick={returnBorrowedApples} className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-bold shadow-lg">
                    还回去！ <ArrowRight className="inline" />
                  </button>
                </div>
              )}

              {/* Step 3: Final answer */}
              {diffStep === 3 && (
                <div className="animate-in zoom-in max-w-lg w-full text-center bg-white p-8 rounded-3xl shadow-2xl border-4 border-pink-200">
                  <h3 className="text-xl font-bold text-gray-500 mb-4 uppercase">差同减差</h3>
                  <div className="text-3xl font-bold text-gray-700 mb-4">
                    <span className="text-pink-500">56</span> - <span className="text-yellow-500">3</span> = <span className="text-pink-600 text-5xl">53</span>
                  </div>
                  <p className="text-gray-500 mb-6">这个例子的答案是53个苹果！</p>
                  <button onClick={reset} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 mx-auto">
                    <RotateCcw size={14} /> 再玩一次
                  </button>
                </div>
              )}
            </div>
          </PhaseCard>
        )}

        {/* CRT Method Phase (韩信点兵) */}
        {phase === AppPhase.CRT_METHOD && (
          <PhaseCard title="韩信点兵：特种兵法" color="indigo">
            <div className="flex flex-col items-center min-h-[500px] justify-start py-4">

              {/* Step 0: Find Agent A */}
              {crtStep === 0 && (
                <div className="animate-in fade-in max-w-2xl w-full text-center">
                  <h3 className="text-2xl font-bold text-indigo-900 mb-6">寻找特种兵A</h3>
                  <p className="text-gray-600 mb-4">
                    特种兵A的特点：是<span className="font-bold text-purple-600">8的倍数</span>，但分成7个一堆时<span className="font-bold text-red-500">多1个</span>。
                  </p>

                  <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-100 mb-6">
                    <p className="text-5xl font-black text-indigo-600 mb-4">{crtAgentA}</p>
                    <div className="flex justify-center gap-4 text-sm">
                      <span className={`px-3 py-1 rounded-full ${crtAgentA % 8 === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        ÷8 {crtAgentA % 8 === 0 ? '✓' : '✗'}
                      </span>
                      <span className={`px-3 py-1 rounded-full ${crtAgentA % 7 === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        ÷7余1 {crtAgentA % 7 === 1 ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>

                  {crtAgentA % 8 === 0 && crtAgentA % 7 === 1 ? (
                    <div className="animate-in zoom-in">
                      <p className="text-green-600 font-bold text-lg mb-4">找到特种兵A = 8！</p>
                      <button onClick={() => setCrtStep(1)} className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg">
                        继续找特种兵B！ <ArrowRight className="inline" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={nextCrtAgentA} className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg">
                      试下一个 (+8)
                    </button>
                  )}
                </div>
              )}

              {/* Step 1: Find Agent B */}
              {crtStep === 1 && (
                <div className="animate-in fade-in max-w-2xl w-full text-center">
                  <h3 className="text-2xl font-bold text-indigo-900 mb-6">寻找特种兵B</h3>
                  <p className="text-gray-600 mb-4">
                    特种兵B的特点：是<span className="font-bold text-green-600">7的倍数</span>，但分成8个一堆时<span className="font-bold text-red-500">多1个</span>。
                  </p>

                  <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-100 mb-6">
                    <p className="text-5xl font-black text-indigo-600 mb-4">{crtAgentB}</p>
                    <div className="flex justify-center gap-4 text-sm">
                      <span className={`px-3 py-1 rounded-full ${crtAgentB % 7 === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        ÷7 {crtAgentB % 7 === 0 ? '✓' : '✗'}
                      </span>
                      <span className={`px-3 py-1 rounded-full ${crtAgentB % 8 === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        ÷8余1 {crtAgentB % 8 === 1 ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>

                  {crtAgentB % 7 === 0 && crtAgentB % 8 === 1 ? (
                    <div className="animate-in zoom-in">
                      <p className="text-green-600 font-bold text-lg mb-4">找到特种兵B = 49！</p>
                      <button onClick={() => setCrtStep(2)} className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg">
                        组建军队！ <Sword className="inline" size={20} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={nextCrtAgentB} className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg">
                      试下一个 (+7)
                    </button>
                  )}
                </div>
              )}

              {/* Step 2: Assemble */}
              {crtStep === 2 && (
                <div className="animate-in fade-in max-w-2xl w-full text-center">
                  <h3 className="text-2xl font-bold text-indigo-900 mb-6">组建军队</h3>
                  <p className="text-gray-600 mb-6">
                    线索说"多4个"，所以我们派出：<br />
                    <span className="font-bold">4 × 特种兵A(8) + 4 × 特种兵B(49)</span>
                  </p>

                  <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-100 mb-6">
                    <p className="text-2xl font-bold text-gray-700">
                      4 × 8 + 4 × 49 = 32 + 196 = <span className="text-indigo-600 text-4xl">228</span>
                    </p>
                  </div>

                  <button onClick={assembleArmy} className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg">
                    开始减兵！ <ArrowRight className="inline" />
                  </button>
                </div>
              )}

              {/* Step 3: Reduce */}
              {crtStep === 3 && (
                <div className="animate-in fade-in max-w-2xl w-full text-center">
                  <h3 className="text-2xl font-bold text-indigo-900 mb-6">减去大方阵</h3>
                  <p className="text-gray-600 mb-4">
                    每56人（7×8）组成一个大方阵撤走，直到剩下最后的人数！
                  </p>

                  <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-100 mb-6">
                    <p className={`text-5xl font-black transition-all ${crtCurrentTotal === 60 ? 'text-green-600' : 'text-indigo-600'}`}>
                      {crtCurrentTotal}
                    </p>
                    {crtCurrentTotal > 60 && (
                      <p className="text-gray-500 mt-2">- 56 = {crtCurrentTotal - 56}</p>
                    )}
                  </div>

                  {crtCurrentTotal > 60 ? (
                    <button onClick={reduceArmy} className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg animate-pulse">
                      撤走一个方阵 (-56)
                    </button>
                  ) : (
                    <div className="animate-in zoom-in">
                      <p className="text-green-600 font-bold text-2xl mb-4">🎉 答案是 60！</p>
                      <button onClick={reset} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-2 rounded-full font-bold flex items-center gap-2 mx-auto">
                        <RotateCcw size={14} /> 再玩一次
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </PhaseCard>
        )}

        {/* Advanced Explain Phase (Existing) */}
        {phase === AppPhase.ADVANCED_EXPLAIN && (
          <PhaseCard title="魔法侦探课：寻找小尾巴" color="orange">
            <div className="space-y-6 text-center min-h-[500px] flex flex-col items-center justify-start py-4">

              {/* Progress Steps */}
              <div className="flex gap-2 md:gap-4 mb-2 w-full justify-center text-sm md:text-base">
                {[
                  { icon: Eye, label: '火眼金睛' },
                  { icon: PauseCircle, label: '请出小尾巴' },
                  { icon: Grid3X3, label: '完美方块' },
                  { icon: PlusCircle, label: '最后合体' }
                ].map((step, idx) => (
                  <div key={idx} className={`flex flex-col items-center transition-colors ${magicStep >= idx ? 'text-indigo-600 font-bold' : 'text-gray-300'}`}>
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-1 border-2 ${magicStep >= idx ? 'bg-indigo-100 border-indigo-500' : 'bg-gray-50 border-gray-200'}`}>
                      <step.icon size={16} />
                    </div>
                    <span className="text-xs">{step.label}</span>
                  </div>
                ))}
              </div>

              {/* Step 0: The "Eye" */}
              {magicStep === 0 && (
                <div className="animate-in fade-in slide-in-from-bottom duration-500 max-w-2xl w-full flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-indigo-900 mb-2">第一步：用侦探的眼睛看世界</h3>
                  <p className="text-gray-600 mb-8 max-w-lg">
                    “差 4 个”听起来很麻烦。但是，如果我们把袋子打开看看，<br />
                    <span className="text-indigo-600 font-bold">里面到底坐着几个苹果呢？</span>
                  </p>

                  <div className="relative group cursor-pointer transform transition hover:scale-105" onClick={transformBagToLeftover}>
                    {/* The Bag Container */}
                    <div className={`w-48 h-56 rounded-3xl border-4 transition-all duration-500 flex flex-col items-center justify-end pb-4 shadow-xl overflow-hidden
                       ${magicVisualState === 'initial' ? 'bg-purple-100 border-purple-300 border-dashed' : 'bg-transparent border-transparent shadow-none'}`}>

                      {/* Label */}
                      <div className={`absolute top-4 bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-bold transition-opacity duration-300 ${magicVisualState === 'transformed' ? 'opacity-0' : 'opacity-100'}`}>
                        想装 8 个，差 4 个
                      </div>

                      {/* Contents */}
                      <div className="grid grid-cols-2 gap-2 p-4">
                        <Apple size="lg" className="animate-bounce-slight" style={{ animationDelay: '0s' }} />
                        <Apple size="lg" className="animate-bounce-slight" style={{ animationDelay: '0.1s' }} />
                        <Apple size="lg" className="animate-bounce-slight" style={{ animationDelay: '0.2s' }} />
                        <Apple size="lg" className="animate-bounce-slight" style={{ animationDelay: '0.3s' }} />

                        {/* The 4 Missing Slots */}
                        {magicVisualState === 'initial' && (
                          <>
                            <div className="w-12 h-12 rounded-full border-2 border-dashed border-purple-300 bg-purple-50/50 flex items-center justify-center text-purple-200 text-xs">缺</div>
                            <div className="w-12 h-12 rounded-full border-2 border-dashed border-purple-300 bg-purple-50/50 flex items-center justify-center text-purple-200 text-xs">缺</div>
                            <div className="w-12 h-12 rounded-full border-2 border-dashed border-purple-300 bg-purple-50/50 flex items-center justify-center text-purple-200 text-xs">缺</div>
                            <div className="w-12 h-12 rounded-full border-2 border-dashed border-purple-300 bg-purple-50/50 flex items-center justify-center text-purple-200 text-xs">缺</div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Hand Indicator */}
                    {magicVisualState === 'initial' && (
                      <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 animate-bounce text-indigo-500 font-bold text-sm whitespace-nowrap">
                        👆 点击袋子看真相
                      </div>
                    )}
                  </div>

                  {magicVisualState === 'transformed' && (
                    <div className="mt-4 animate-in zoom-in duration-300 text-center">
                      <p className="text-xl font-bold text-purple-700 mb-4">
                        原来袋子里实实在在有 <span className="text-3xl">4</span> 个苹果！
                      </p>
                      <div className="bg-yellow-100 p-4 rounded-xl border-l-4 border-yellow-400 text-yellow-800 text-left text-sm md:text-base max-w-md">
                        💡 <strong>侦探发现：</strong><br />
                        线索1是“多4个”，线索2也是“多4个”。<br />
                        这就是我们都要找的<strong>“4个小尾巴”</strong>！
                      </div>
                      <button onClick={() => setMagicStep(1)} className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 mx-auto hover:bg-indigo-700 transition">
                        既然都有小尾巴... <ArrowRight />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 1: The "Timeout" */}
              {magicStep === 1 && (
                <div className="animate-in fade-in slide-in-from-right duration-500 max-w-xl w-full flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-indigo-900 mb-2">第二步：请出“小尾巴”</h3>
                  <p className="text-gray-600 mb-6">
                    这两边的“4个小尾巴”太捣乱了，让我们先把它们请到<span className="font-bold text-indigo-600">休息区</span>坐一会儿。
                  </p>

                  <div className="flex gap-8 items-end h-48 mb-8 relative">
                    <div className={`bg-amber-100 border-4 border-amber-200 w-32 h-32 rounded-2xl flex items-center justify-center transition-all duration-700 ${pocketApples === 4 ? 'grayscale opacity-50' : ''}`}>
                      <span className="font-bold text-amber-800">一大堆苹果</span>
                    </div>
                    <div className={`flex flex-col items-center transition-all duration-1000 z-20 ${pocketApples === 4 ? 'translate-x-[120px] translate-y-[20px] scale-75' : ''}`}>
                      <div className="flex gap-1 mb-2">
                        <Apple size="md" className="animate-bounce-slight" />
                        <Apple size="md" className="animate-bounce-slight" style={{ animationDelay: '0.1s' }} />
                      </div>
                      <div className="flex gap-1">
                        <Apple size="md" className="animate-bounce-slight" style={{ animationDelay: '0.2s' }} />
                        <Apple size="md" className="animate-bounce-slight" style={{ animationDelay: '0.3s' }} />
                      </div>
                      {pocketApples === 0 && <span className="text-xs font-bold text-red-500 mt-2 bg-white px-2 rounded-full border border-red-200">我是小尾巴</span>}
                    </div>
                    <div className="absolute -right-20 bottom-0 w-40 h-12 bg-indigo-100 rounded-lg border-b-4 border-indigo-300 flex items-center justify-center">
                      <span className="text-indigo-400 text-xs font-bold absolute -bottom-6">休息区</span>
                    </div>
                  </div>

                  {pocketApples === 0 ? (
                    <button onClick={hideApplesToPocket} className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg animate-pulse">
                      👉 把小尾巴移到休息区
                    </button>
                  ) : (
                    <div className="text-center animate-in zoom-in">
                      <p className="text-green-600 font-bold text-lg mb-4">太好了！现在的苹果非常整齐！</p>
                      <button onClick={() => setMagicStep(2)} className="bg-gray-800 text-white px-8 py-3 rounded-full font-bold shadow-lg">
                        现在的苹果是多少？ <ArrowRight className="inline" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: The Perfect Block */}
              {magicStep === 2 && (
                <div className="animate-in fade-in slide-in-from-right duration-500 max-w-xl w-full flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-indigo-900 mb-2">第三步：完美的方块</h3>
                  <p className="text-gray-600 mb-6">
                    没有了捣乱的小尾巴，剩下的苹果<br />既能分给 <span className="text-green-600 font-bold">7</span> 个人，也能分给 <span className="text-purple-600 font-bold">8</span> 个人。
                  </p>
                  <div className="bg-white p-4 rounded-2xl shadow-xl border-4 border-indigo-100 mb-6">
                    <div className="grid grid-cols-8 gap-1 w-fit mx-auto">
                      {Array.from({ length: 56 }).map((_, i) => (
                        <div key={i} className="w-3 h-3 md:w-4 md:h-4 bg-indigo-400 rounded-sm animate-in zoom-in" style={{ animationDelay: `${i * 0.01}s` }}></div>
                      ))}
                    </div>
                    <div className="mt-4 text-center border-t border-gray-100 pt-2">
                      <span className="text-gray-500 text-sm">7 行 × 8 列 = </span>
                      <span className="text-3xl font-black text-indigo-600 ml-2">56</span>
                    </div>
                  </div>
                  <button onClick={() => setMagicStep(3)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold shadow-lg">
                    这就是答案吗？ <ArrowRight className="inline" />
                  </button>
                </div>
              )}

              {/* Step 3: The Reunion */}
              {magicStep === 3 && (
                <div className="animate-in fade-in slide-in-from-right duration-500 max-w-xl w-full flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-indigo-900 mb-2">最后一步：接回小尾巴</h3>
                  <p className="text-gray-600 mb-8">
                    别忘了！休息区里还有 <span className="font-bold text-red-500">4</span> 个苹果在等我们呢。
                  </p>
                  <div className="flex items-center gap-2 md:gap-4 text-2xl md:text-5xl font-black text-gray-700 mb-10 bg-white p-6 md:p-10 rounded-3xl shadow-2xl border-4 border-yellow-200 w-full justify-center">
                    <div className="flex flex-col items-center">
                      <span className="text-indigo-500">56</span>
                      <span className="text-xs text-gray-400 font-normal mt-2 text-base">方块</span>
                    </div>
                    <PlusCircle size={32} className="text-gray-300" />
                    <div
                      onClick={returnApplesFromPocket}
                      className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${pocketApples === 0 ? 'scale-110' : 'scale-100 hover:scale-105'}`}
                    >
                      <span className={pocketApples === 0 ? "text-red-500" : "text-gray-300"}>
                        {pocketApples === 0 ? 4 : "?"}
                      </span>
                      <span className="text-xs text-gray-400 font-normal mt-2 text-base">休息区</span>
                    </div>
                    <span>=</span>
                    <span className={`transition-all duration-500 ${pocketApples === 0 ? 'text-green-600 scale-125' : 'text-gray-200'}`}>
                      60
                    </span>
                  </div>
                  {pocketApples > 0 && (
                    <button onClick={returnApplesFromPocket} className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg animate-bounce">
                      把 4 个苹果加回来！
                    </button>
                  )}
                  {pocketApples === 0 && (
                    <div className="flex gap-4 animate-in fade-in slide-in-from-bottom duration-500">
                      <button onClick={reset} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-3 rounded-full font-bold flex items-center gap-2">
                        <RotateCcw size={18} /> 再玩一次
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </PhaseCard>
        )}

      </main>

      {/* The Wise Owl Helper */}
      <OwlGuide
        phase={phase}
        stepData={
          phase === AppPhase.STEP_7 ? sequence7 :
            phase === AppPhase.STEP_8 ? sequence8 :
              phase === AppPhase.ADVANCED_EXPLAIN ? { magicStep } :
                phase === AppPhase.SURPLUS_METHOD ? { surplusStep } :
                  phase === AppPhase.GENERAL_FROG ? { frogNum } :
                    phase === AppPhase.VISUAL_CYCLE ? { cycleStep } :
                      phase === AppPhase.DIFF_SAME_METHOD ? { diffStep } :
                        phase === AppPhase.CRT_METHOD ? { crtStep } :
                          phase === AppPhase.STACKING_METHOD ? { stackStep } :
                            null
        }
      />
    </div>
  );
}
