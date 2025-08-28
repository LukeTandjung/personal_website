import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { ProjectCard } from "./card/ProjectCard";
import { type Project, type Common } from "types";

export function Carousel({
  commonEn,
}: {
  commonEn: Common;
}): React.ReactElement {
  const autoScroll = React.useRef(
    AutoScroll({
      speed: 0.5,
      startDelay: 500,
      direction: "forward",
      playOnInit: true,
    }),
  );
  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoScroll.current]);

  return (
    <React.Fragment>
      <div className="embla hidden sm:block" ref={emblaRef}>
        <div className="embla__container">
          {commonEn.projects.map((props: Project, index: number) => (
            <ProjectCard key={index} {...props} className="embla__slide" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:hidden">
        {commonEn.projects.map((props: Project, index: number) => (
          <ProjectCard key={index} {...props} className="w-full" />
        ))}
      </div>
    </React.Fragment>
  );
}
