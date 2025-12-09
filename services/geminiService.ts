
import { GoogleGenAI } from "@google/genai";
import { AppPhase, OwlResponse } from "../types";

const getOwlPrompt = (phase: AppPhase, stepData: any): string => {
  switch (phase) {
    case AppPhase.INTRO:
      return "热情地用中文问候二年级的小朋友。我们要解开一个关于苹果箱子的谜题。保持简短、可爱、有趣。不要用复杂的数学词汇。";
    case AppPhase.STEP_7:
      return `我们在看如果每袋装7个苹果，还多4个。简单解释意思就是：不管装满了几袋，最后手里总会剩下4个孤零零的苹果。不要提“除法”或“余数”，就说“剩下的”。保持在20个字以内，用中文。`;
    case AppPhase.STEP_8:
      return `我们正在看线索2：每袋装8个，但是差4个。请用最简单的语言解释：这就好比一个能装8个苹果的盒子，还有4个空位没填满。那盒子里现在躺着几个苹果呢？引导小朋友去数这一步。`;
    case AppPhase.COMPARE:
      return "我们有了两串数字。请热情地让小朋友找出那个同时出现在两串数字里的神奇数字！告诉他们这个数字就是苹果的总数。";
    case AppPhase.SUCCESS:
      return "恭喜小朋友！答案是60。简单解释一下：60个苹果，7个一堆分，最后剩4个；8个一堆分，最后也剩4个（因为差4个就是剩4个）。太棒了！";
    case AppPhase.ADVANCED_EXPLAIN:
      // stepData contains the magicStep index (0, 1, 2, 3)
      const step = stepData?.magicStep || 0;
      if (step === 0) {
        return "我想教小朋友一个‘侦探’技巧。看右边那个装不满的袋子（8个一袋，差4个）。请引导小朋友思考：‘虽然还缺4个，但是袋子里其实已经躺着几个苹果了呢？’ 引导他们点击那个半空的袋子来看看真相！";
      } else if (step === 1) {
        return "现在小朋友发现了，两个线索其实都带着‘4个小尾巴’（多4个）。请建议小朋友先把这4个捣乱的‘小尾巴’请到旁边的‘休息区’去，这样剩下的苹果就变整齐啦！";
      } else if (step === 2) {
        return "小尾巴拿走后，剩下的苹果变得非常听话，既能排成7行，又能排成8列。请告诉小朋友这就是7和8的乘积——56！";
      } else {
        return "最后一步！我们的谜题快解开了。别忘了‘休息区’里还坐着4个苹果呢。请引导小朋友把它们接回来，算出最后的总数。";
      }
    case AppPhase.SURPLUS_METHOD:
      const sStep = stepData?.surplusStep || 0;
      if (sStep === 0) {
        return "我们要玩一个‘喂袋子’的游戏。告诉小朋友：现在每个袋子只有7个苹果，如果要变成8个，每个袋子都需要‘多吃’1个苹果。";
      } else if (sStep === 1) {
        return "我们手里正好有多出来的4个苹果。请引导小朋友把这4个苹果分给袋子们，看看能喂饱几个袋子？";
      } else if (sStep === 2) {
        return "哎呀！题目说还‘差4个’（缺4个）。这意味着还有几个袋子张着嘴巴在等苹果，但是我们没有苹果了？引导小朋友数数空着的坑位。";
      } else {
        return "破案了！4个袋子吃饱了，还有4个袋子饿着肚子。那总共有几个袋子呢？算出袋子数量（4+4=8），我们就能算出苹果总数啦！";
      }
    case AppPhase.GENERAL_FROG:
      const fNum = stepData?.frogNum || 4;
      if (fNum === 4) {
        return "教小朋友一招‘万能法’！我们只要抓住一条线索（比如7个一袋多4个），然后让青蛙不断跳跃（每次加7），每跳一次，就去问问乌龟（线索2）对不对。";
      } else if (fNum === 60) {
        return "哇！青蛙跳到了60！快让小朋友检查一下，60如果加上4个，是不是正好能被8整除呢？";
      } else {
        return `青蛙跳到了 ${fNum}。请小朋友帮忙检查一下：${fNum} 加上 4 等于 ${fNum+4}。这个数能不能把8个一袋装满？如果不能，青蛙就得继续跳！`;
      }
    case AppPhase.VISUAL_CYCLE:
      const vStep = stepData?.cycleStep || 0;
      if (vStep === 0) {
        return "这招叫‘火车拼接法’。首先我们要找‘火车头’。7个一袋多4个，8个一袋少4个。引导小朋友发现：少4个其实就是兜里有4个！所以‘火车头’是4。";
      } else {
        return "现在我们有两个车队：蓝色车厢长7，紫色车厢长8。从同一个火车头出发，我们要不断加车厢，直到两列火车尾巴对齐！这就叫‘通周期’。";
      }
    case AppPhase.DIFF_SAME_METHOD:
      const dStep = stepData?.diffStep || 0;
      if (dStep === 0) {
        return "现在我们来学一句新口诀：‘差同减差’。为了学会它，我们假装有一个新箱子：7个一袋差3个，8个一袋也差3个。引导小朋友发现它们的共同点：都缺3个！";
      } else if (dStep === 1) {
        return "既然都缺3个，我们可以用魔法‘借’来3个苹果，把空填满。引导小朋友使用借苹果的魔法！";
      } else if (dStep === 2) {
        return "填满后，苹果就变成了整整齐齐的56个（7乘8）。但是别忘了，这3个苹果是借来的！";
      } else {
        return "最后一步：有借就有还！我们要把这3个苹果还回去。56减去借来的3个，答案就是53！";
      }
    case AppPhase.CRT_METHOD:
      const cStep = stepData?.crtStep || 0;
      if (cStep === 0) {
        return "这是古代大将军韩信的方法！我们要找两个‘特种兵’。第一个特种兵：能藏在8人小队里，但在7人小队里会‘多出1个’。让小朋友找找看！";
      } else if (cStep === 1) {
        return "找到了特种兵A是8！现在找特种兵B：能藏在7人小队里，但在8人小队里会‘多出1个’。这个数有点大，要耐心试一试哦！";
      } else if (cStep === 2) {
        return "两个特种兵都找到了！线索1说‘多4个’，我们就派4个特种兵A；线索2说‘差4个’（其实也是多4个），就派4个特种兵B。算算一共多少人？";
      } else {
        return "哇，228人太多了！韩信将军说：‘每56人（7和8的公倍数）可以组成一个大方阵撤走’。我们不断减去56，直到剩下最后的答案！";
      }
    case AppPhase.STACKING_METHOD:
      const stStep = stepData?.stackStep || 0;
      if (stStep === 0) {
        return "这招叫‘层层堆叠法’！首先看线索2，8个一袋少4个，这是什么意思呢？点一下那个线索卡片，看看袋子里的秘密！";
      } else if (stStep === 1) {
        return "现在我们用‘7个一行’来堆苹果。但是，别忘了我们的目标！这堆苹果必须也能被8整除（装满8个一袋）。请引导小朋友：我们一行行加，每加一行，就检查一下‘现在能分给8个人吗？’";
      } else if (stStep === 2) {
        return "看！当我们堆到第8行时，总数是56。56正好也能被8整除！这意味着我们找到了完美的矩形！";
      } else {
        return "别忘了那4个被我们放一边的苹果！快把它们加回来！";
      }
    default:
      return "说你好！";
  }
};

const getFallbackMessage = (phase: AppPhase, stepData: any): OwlResponse => {
  switch (phase) {
    case AppPhase.INTRO:
      return { message: "你好呀！我是你的数学小助手。我们有一个装满苹果的神秘箱子，只有解开两个线索，才能知道里面有多少苹果。准备好了吗？", mood: 'excited' };
    case AppPhase.STEP_7:
      return { message: "这是第一个线索：每 7 个装一袋，还多 4 个。也就是说，不管装几袋，最后都会剩下 4 个孤零零的苹果。试试加一袋看看！", mood: 'happy' };
    case AppPhase.STEP_8:
      return { message: "这是第二个线索：每 8 个装一袋，差 4 个。‘差4个’其实很有意思，说明如果我们想装满，手里其实只有 4 个苹果。我们来做个小实验看看！", mood: 'thinking' };
    case AppPhase.COMPARE:
      return { message: "现在我们有了两列数字。你需要像侦探一样，找到那个同时出现在两边的一模一样的数字。它就是答案！", mood: 'excited' };
    case AppPhase.SUCCESS:
      return { message: "哇！太棒了！答案就是 60！60个苹果，7个一袋分剩4个；8个一袋分也剩4个。你解开了谜题！", mood: 'excited' };
    case AppPhase.ADVANCED_EXPLAIN:
      const step = stepData?.magicStep || 0;
      if (step === 0) return { message: "看！8个一袋差4个，其实就是袋子里已经有4个苹果了！点一下袋子看看真相！", mood: 'thinking' };
      if (step === 1) return { message: "既然两边都‘多4个’，那这4个就是捣乱鬼。我们先把它们请到‘休息区’去！", mood: 'happy' };
      if (step === 2) return { message: "没有了小尾巴，剩下的苹果正好是7和8的整倍数。那就是56！", mood: 'excited' };
      return { message: "别忘了休息区的4个苹果，把它们加回来，就是最终答案啦！", mood: 'happy' };
    case AppPhase.SURPLUS_METHOD:
      const sStep = stepData?.surplusStep || 0;
      if (sStep === 0) return { message: "要把7个一袋变成8个一袋，每个袋子都需要‘多吃’1个苹果哦！", mood: 'thinking' };
      if (sStep === 1) return { message: "我们手里多出4个苹果，快把它们分给袋子们！看看能喂饱几个？", mood: 'happy' };
      if (sStep === 2) return { message: "哎呀，还有袋子饿着（差4个），说明还有4个空位没填满。", mood: 'thinking' };
      return { message: "4个吃饱的袋子 + 4个饿着的袋子 = 8个袋子！算出总数了吗？", mood: 'excited' };
    case AppPhase.GENERAL_FROG:
      const fNum = stepData?.frogNum || 4;
      if (fNum === 60) return { message: "青蛙跳到了60！快检查一下，60是不是我们要找的数字？", mood: 'excited' };
      return { message: `青蛙跳到了 ${fNum}。${fNum} 加上 4 能装满8个一袋的袋子吗？点“检查”看看！`, mood: 'happy' };
    case AppPhase.VISUAL_CYCLE:
      const vStep = stepData?.cycleStep || 0;
      if (vStep === 0) return { message: "既然两边都‘多4个’，那我们的起点（火车头）就是4。", mood: 'thinking' };
      return { message: "上面的车厢长7，下面的长8。拼拼看，什么时候它们能再次对齐？", mood: 'happy' };
    case AppPhase.DIFF_SAME_METHOD:
      const dStep = stepData?.diffStep || 0;
      if (dStep === 0) return { message: "假如题目变成：7个一袋差3个，8个一袋也差3个。这叫‘差同’！", mood: 'thinking' };
      if (dStep === 1) return { message: "既然都缺3个，我们就用魔法‘借’来3个苹果，把空填满！", mood: 'happy' };
      if (dStep === 2) return { message: "填满后就是56。但是别忘了，这3个是借来的哦。", mood: 'thinking' };
      return { message: "有借就有还！56减去借来的3个，答案就是53！", mood: 'excited' };
    case AppPhase.CRT_METHOD:
      const cStep = stepData?.crtStep || 0;
      if (cStep === 0) return { message: "我们要找‘特种兵’！特种兵A：是8的倍数，但分成7个一堆多1个。是谁呢？", mood: 'thinking' };
      if (cStep === 1) return { message: "现在找特种兵B：是7的倍数，但分成8个一堆多1个。这个数有点大，试试49！", mood: 'excited' };
      if (cStep === 2) return { message: "线索都说‘多4个’。所以：(4个特种兵A) + (4个特种兵B) = 总数。", mood: 'happy' };
      return { message: "228人太多啦！每56人组成一队撤走，最后剩下几个人？", mood: 'thinking' };
    case AppPhase.STACKING_METHOD:
      const stStep = stepData?.stackStep || 0;
      if (stStep === 0) return { message: "首先看线索2，8个一袋少4个，这是什么意思呢？点一下那个线索卡片，看看袋子里的秘密！", mood: 'thinking' };
      if (stStep === 1) return { message: "我们用‘7个一行’来堆苹果。但是，剩下的苹果必须也能被8整除！所以我们一行行加，直到找到那个神奇的数字！", mood: 'thinking' };
      if (stStep === 2) return { message: "哇！第8行的时候，7和8终于对齐了！这就是56。", mood: 'excited' };
      return { message: "56加上刚才放一边的4个，就是60！", mood: 'happy' };
    default:
      return { message: "加油！你一定能行！", mood: 'happy' };
  }
}

export const fetchOwlAdvice = async (phase: AppPhase, stepData: any = null): Promise<OwlResponse> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return getFallbackMessage(phase, stepData);
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = getOwlPrompt(phase, stepData);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "你是一只聪明友好的猫头鹰，正在教2年级的小朋友学数学。请用中文（简体）回答，语言要简单、口语化、充满鼓励。避免使用复杂的数学术语（如‘除以’、‘余数’、‘模’），改用生活化的表达（如‘装袋’、‘剩下’、‘小尾巴’、‘空位’）。只返回包含 'message' 和 'mood' 键的 JSON 对象。",
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    
    return JSON.parse(text) as OwlResponse;
  } catch (error) {
    console.warn("Owl unavailable (using fallback):", error);
    return getFallbackMessage(phase, stepData);
  }
};
