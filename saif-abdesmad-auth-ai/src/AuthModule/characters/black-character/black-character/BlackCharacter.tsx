import React, { JSX, useContext, useEffect, useRef } from "react";
import { BlackCharacterController } from "../controller/BlackCharacterController";
import { CharacterContext } from "../../../context/CharactersContext";
import { CharacterOrchestratorService } from "../../../service/CharacterOrchestratorService";
import "./BlackCharacter.css";

export function BlackCharacter(): JSX.Element {
  const orchestratorService =
    useContext(CharacterContext) as CharacterOrchestratorService;

  const characterBodyRef = useRef<SVGGElement | null>(null);
  const eyePairContainerRef = useRef<SVGGElement | null>(null);
  const characterShapeRef = useRef<SVGPathElement | null>(null);
  const eyePairElementRef = useRef<SVGGElement | null>(null);

  const characterColor = "#0B1320";

  useEffect(() => {
    if (
      !characterShapeRef.current ||
      !characterBodyRef.current ||
      !eyePairContainerRef.current ||
      !eyePairElementRef.current
    )
      return;

    const controller = new BlackCharacterController(
      orchestratorService.getLatestPos,
      characterShapeRef.current,
      characterBodyRef.current,
      eyePairContainerRef.current,
      eyePairElementRef.current
    );
    orchestratorService.register(controller);

    return () => orchestratorService.unregister(controller);
  }, [orchestratorService]);

  return (
    <svg viewBox="0 0 130 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <g ref={characterBodyRef} id="character-body" transform="translate(0,0) rotate(0)">
        <path ref={characterShapeRef} id="character-shape" fill={characterColor} />

        <g ref={eyePairContainerRef} id="eye-pair-container" transform="translate(0,0)">
          <g id="eyePair" ref={eyePairElementRef} transform="translate(40,25)">
            <g id="leftEye" transform="translate(-11,0)">
              <circle className="sclera" cx="0" cy="0" r="8" fill="white" stroke={characterColor} strokeWidth="1" />
              <circle id="leftPupil" className="eye-pupil" cx="0" cy="0" r="4" fill="black" />
              <path id="leftEyelid" fill={characterColor} />
            </g>

            <g id="rightEye" transform="translate(11,0)">
              <circle className="sclera" cx="0" cy="0" r="8" fill="white" stroke={characterColor} strokeWidth="1" />
              <circle id="rightPupil" className="eye-pupil" cx="0" cy="0" r="4" fill="black" />
              <path id="rightEyelid" fill={characterColor} />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

export default BlackCharacter;