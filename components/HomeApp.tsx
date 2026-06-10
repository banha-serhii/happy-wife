"use client";

import { useState } from "react";
import FinishScreen from "@/components/FinishScreen";
import QuestionScreen from "@/components/QuestionScreen";
import ScreenContainer from "@/components/ScreenContainer";

type Screen = "TRAP" | "CONFIRMATION" | "FINISHER";

export default function HomeApp() {
  const [screen, setScreen] = useState<Screen>("TRAP");

  return (
    <ScreenContainer>
      {screen === "TRAP" && (
        <QuestionScreen
          key="trap"
          emoji="💬"
          eyebrow="Happy Wife"
          title="Хочете пожалітись на поведінку Вашої дружини?"
          subtitle="Оберіть відповідь обережно. Система уважно аналізує рівень вашої сміливості."
          onYes={() => setScreen("CONFIRMATION")}
          onNo={() => setScreen("FINISHER")}
        />
      )}

      {screen === "CONFIRMATION" && (
        <QuestionScreen
          key="confirmation"
          emoji="🤨"
          eyebrow="Перевірка рішення"
          title="Ти впевнений?"
          subtitle="Це останній шанс змінити відповідь і зберегти гармонію в домі."
          onYes={() => setScreen("FINISHER")}
          onNo={() => setScreen("TRAP")}
          emphasizeNo
          yesRequiresCatch
        />
      )}

      {screen === "FINISHER" && (
        <FinishScreen key="finisher" onRestart={() => setScreen("TRAP")} />
      )}
    </ScreenContainer>
  );
}
