import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

import { CharacterContext } from "../context/CharactersContext";

import { BlackCharacter } from "../characters/black-character/black-character/BlackCharacter";
import {PurpleCharacter} from "../characters/purple-character/purple-character/PurpleCharacter";
import YellowCharacter from "../characters/yellow-character/yellow-character/YellowCharacter";
import { useContext, useEffect } from "react";
import { CharacterOrchestratorService } from "../service/CharacterOrchestratorService";

export const AuthLayout = () => {

  const orchestratorService =
      useContext(CharacterContext) as CharacterOrchestratorService;

  useEffect(() => {
    orchestratorService.playEntrance();
  }, []);



  return (
    <div className="min-h-screen flex flex-col">
      <Navbar minimal />

     
      <div className="grid grid-cols-[3fr_2fr] flex-1 bg-gradient-to-br from-[#0f0f10] via-[#1a1a1f] to-[#0b0b0c]">
        

        {/* LEFT: Visual side */}
        {/* the provider , provide the character orchestrator service to be used */}
 

        <section className="relative w-full h-full overflow-hidden bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_40%)]">

          <div className="character-wrapper w-[240px]  absolute bottom-20 z-10 left-[220px]">
             <PurpleCharacter />
          </div>
        
          <div className="absolute bottom-[79px] left-[420px] z-10 w-[180px]">
              <BlackCharacter />
          </div>
           

          <div className="absolute bottom-20 left-[520px] z-10 w-[160px]">
              <YellowCharacter />
          </div>
        </section>


        {/* RIGHT: Form side */}
        <section className="bg-white rounded-2xl m-2 flex flex-col justify-center px-20">
          <Outlet />
        </section>

      </div>
    </div>
  );
};