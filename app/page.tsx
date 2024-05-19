import Image from 'next/image';
import fImage1 from '../public/finance1.jpg';
import fImage2 from '../public/finance2.png';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-between p-10">
      <h1 className="mt-6 text-4xl">
        Personīgo finanšu pārvaldības tīmekļa lietotne
      </h1>
      <div className="mt-4 indent-8">
        Uzsāc pārvaldīt finanses tieši šeit! Tavs mīļākais finanšu pārvaldības
        rīks. Esam šeit kopš 2024. gada un palīdzēsim jums pārvaldīt personīgās
        finanses.
      </div>
      <div className="flex items-center justify-between mt-8">
        <div className="w-1/2 indent-8">
          Some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text
        </div>
        <div className="w-1/2">
          <Image
            src={fImage2}
            alt="Finance picture 1"
            height={500}
            width={500}
          />
        </div>
      </div>
      <div className="flex items-center justify-between mt-8">
        <div className="w-1/2">
          <Image
            src={fImage1}
            alt="Finance picture 1"
            height={500}
            width={500}
          />
        </div>
        <div className="w-1/2 indent-8">
          Some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text some text some text
          some text some text some text some text some text
        </div>
      </div>
    </div>
  );
};
export default Home;
