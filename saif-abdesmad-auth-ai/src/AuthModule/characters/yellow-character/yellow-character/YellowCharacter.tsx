import React, { JSX, useContext, useEffect, useRef } from "react";
import { YellowCharacterController } from "../controller/YellowCharacterController";
import { CharacterContext } from "../../../context/CharactersContext";
import { CharacterOrchestratorService } from "../../../service/CharacterOrchestratorService";
import { MirrorElementsGroup } from "../../shared/core/types/MirrorElemetns";

export function YellowCharacter(): JSX.Element {
  const orchestratorService =
    useContext(CharacterContext) as CharacterOrchestratorService;

  // BODY
  const characterBodyRef = useRef<SVGGElement | null>(null);
  const characterBodyMirrorRef = useRef<SVGGElement | null>(null);

  // FACE CONTAINER
  const faceContainerRef = useRef<SVGGElement | null>(null);
  const faceContainerMirrorRef = useRef<SVGGElement | null>(null);

  // SHAPE + CLIP
  const characterShapeRef = useRef<SVGPathElement | null>(null);
  const bodyClipPathRef = useRef<SVGPathElement | null>(null);

  // FACE
  const faceRef = useRef<SVGGElement | null>(null);
  const faceMirrorRef = useRef<SVGGElement | null>(null);

  // MOUTH
  const mouthRef = useRef<SVGGElement | null>(null);


  const characterColor = "#e6c20b";


  useEffect(() => {
    if (
      !characterBodyRef.current ||
      !characterBodyMirrorRef.current ||
      !faceContainerRef.current ||
      !faceContainerMirrorRef.current ||
      !characterShapeRef.current ||
      !bodyClipPathRef.current ||
      !faceRef.current ||
      !faceMirrorRef.current ||
      !mouthRef.current ||
      !orchestratorService
    )
      return;

    const bodyMirrorGroup: MirrorElementsGroup = {
      original: characterBodyRef.current,
      mirrors: [characterBodyMirrorRef.current],
    };

    const faceContainerMirrorGroup: MirrorElementsGroup = {
      original: faceContainerRef.current,
      mirrors: [faceContainerMirrorRef.current],
    };

    const faceMirrorGroup: MirrorElementsGroup = {
      original: faceRef.current,
      mirrors: [faceMirrorRef.current],
    };

    const controller = new YellowCharacterController(
      orchestratorService.getLatestPos,
      characterShapeRef.current,
      bodyMirrorGroup,
      faceContainerMirrorGroup,
      faceMirrorGroup,
      bodyClipPathRef.current,
      mouthRef.current
    );

    orchestratorService.register(controller);

    return () => orchestratorService.unregister(controller);
  }, [orchestratorService]);

  return (
    <svg
      viewBox="0 0 160 250"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="bodyClip">
          <path ref={bodyClipPathRef} />
        </clipPath>
      </defs>

      <g
        ref={characterBodyRef}
        id="character-body"
        transform="translate(0, 0) rotate(0)"
        clipPath="url(#bodyClip)"
      >
        <path ref={characterShapeRef} fill={characterColor} />

        <g
          ref={faceContainerRef}
          id="face-container"
          transform="translate(0, 0)"
        >
          <g ref={faceRef} id="face" transform="translate(60, 80)">
            <g id="leftEye" transform="translate(-35, 0)">
              <ellipse
                className="sclera"
                cx="0"
                cy="0"
                rx="4"
                ry="4"
                fill="black"
                stroke={characterColor}
                strokeWidth="0.5"
              />
              <path id="leftEyelid" fill={characterColor} />
            </g>

            <g id="rightEye" transform="translate(35, 0)">
              <ellipse
                className="sclera"
                cx="0"
                cy="0"
                rx="4"
                ry="4"
                fill="black"
                stroke="#e6c20b"
                strokeWidth="0.5"
              />
              <path id="rightEyelid" fill={characterColor} />
            </g>
          </g>
        </g>
      </g>

      <g
        ref={characterBodyMirrorRef}
        id="character-body-mirror"
        transform="translate(0, 0) rotate(0)"
      >
        <g
          ref={faceContainerMirrorRef}
          id="face-container"
          transform="translate(0, 0)"
        >
          <g ref={faceMirrorRef} id="face" transform="translate(60, 80)">
            <g ref={mouthRef} id="mouth" transform="translate(0, 20)">
              <path
                id="mouthShape"
                fill="none"
                stroke="black"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

export default YellowCharacter;