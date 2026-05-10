import React, { JSX, useContext, useEffect, useRef } from "react";
import { PurpleCharacterController } from "../controller/PurpleCharacterController";
import { CharacterContext } from "../../../context/CharactersContext";
import { CharacterOrchestratorService } from "../../../service/CharacterOrchestratorService";
import "./PupuleCharacter.css";

export function PurpleCharacter(): JSX.Element {

  const orchestratorService =
    useContext(CharacterContext) as CharacterOrchestratorService;

  const characterBodyRef = useRef<SVGGElement | null>(null);
  const characterShapeRef = useRef<SVGPathElement | null>(null);
  const faceContainerRef = useRef<SVGGElement | null>(null);

  const mouthRef = useRef<SVGGElement | null>(null);

  const characterColor = "#6C3BFF";

  useEffect(() => {
    if (
      !characterShapeRef.current ||
      !faceContainerRef.current ||
      !characterShapeRef.current ||
      !mouthRef.current ||
      !orchestratorService
    ) return;

    const controller = new PurpleCharacterController(
        orchestratorService.getLatestPos,
        mouthRef.current,
        characterShapeRef.current,
        characterBodyRef.current!,
        faceContainerRef.current  
    );

    orchestratorService.register(controller);

    return () => orchestratorService.unregister(controller);
  }, [orchestratorService]);

  return (
    <svg viewBox="0 0 160 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <g ref={characterBodyRef} id="character-body" transform="translate(0,0) rotate(0)">
        <path ref={characterShapeRef} id="character-shape" fill={characterColor} />

        <g ref={faceContainerRef} id="face-container" transform="translate(0,0)">
          <g id="face" transform="translate(80,20)">

            <g id="leftEye" transform="translate(-20,0)">
              <ellipse className="sclera" cx="0" cy="0" rx="4" ry="4" fill="white" stroke={characterColor} strokeWidth="0.2"></ellipse>
              <circle id="leftPupil" className="eye-pupil" cx="0" cy="0" r="2" fill="black"></circle>
              <path id="leftEyelid" fill={characterColor}/>
            </g>

            <g id="rightEye" transform="translate(20,0)">
              <ellipse className="sclera" cx="0" cy="0" rx="4" ry="4" fill="white" stroke={characterColor} strokeWidth="0.2"></ellipse>
              <circle id="rightPupil" className="eye-pupil" cx="0" cy="0" r="2" fill="black"></circle>
              <path id="rightEyelid" fill="#6C3BFF"/>
            </g>

            <g ref={mouthRef} id="mouth" transform="translate(0,15)">
              <path id="mouthShape" fill="black" />
            </g>

          </g>
        </g>
      </g>
    </svg>
  );
}

export default PurpleCharacter;