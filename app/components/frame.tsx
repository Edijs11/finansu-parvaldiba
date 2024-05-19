interface FrameProps {
  title: string;
  children: React.ReactNode;
}

const Frame = ({ title, children }: FrameProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 border-state-900 bg-slate-800 rounded-lg shadow-md ounded-xl">
      <h3 className="mb-3 text-xl">{title}</h3>
      {children}
    </div>
  );
};
export default Frame;
