import { format } from "date-fns";

interface ChannelHeroProps {
  name: string;
  creationTime: number;
}

export const ChannelHero = ({ name, creationTime }: ChannelHeroProps) => {
  return (
    <div className="mt-[88px] mx-5 mb-4">
      <p className="text-2xl font-bold flex items-center mb-2">#{name}</p>
      <p className="text-slate-800 font-normal mb-4">
        This channel was created on {format(creationTime, "MMMM do, yyyy")}.
        This is very begining of channel <strong>#{name}</strong> channel
      </p>
    </div>
  );
};
