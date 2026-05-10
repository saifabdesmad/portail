import React, { useRef, ReactNode, createContext } from "react";
import { CharacterOrchestratorService } from "../service/CharacterOrchestratorService";

export const CharacterContext = createContext<CharacterOrchestratorService | null>(null);

type Props = {
  children: ReactNode;
};

export function CharacterServiceProvider({ children }: Props) {
  const serviceRef = useRef<CharacterOrchestratorService>(
    new CharacterOrchestratorService()
  );

  return (
    <CharacterContext.Provider value={serviceRef.current}>
      {children}
    </CharacterContext.Provider>
  );
}
