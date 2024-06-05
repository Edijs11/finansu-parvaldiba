import Image from 'next/image';
import fImage1 from '../public/finance1.jpg';
import fImage2 from '../public/finance2.png';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <h1 className="mt-6 text-4xl">
        Personīgo finanšu pārvaldības tīmekļa lietotne
      </h1>
      <div className="mt-4 indent-8">
        Uzsāc pārvaldīt finanses tieši šeit! Esam šeit kopš 2024. gada un
        palīdzēsim Jums uzsākt pārvaldīt personīgās finanses.
      </div>
      <div className="max-w-5xl mx-auto flex-col lg:flex-row lg:space-x-5 sm:flex-col">
        <div className="sm:flex items-center justify-between mt-10">
          <div className="sm:w-1/2 text-2xl leading-9 p-2">
            <h1 className="text-4xl">Budžeta uzstādīšana</h1>
            <div className="mt-4">
              Pirms finanšu pārvaldīšanas uzsākšanas lietotne iesaka izveidot
              sev piemērotu budžetu sadalot to trīs daļās: nepieciešamības,
              vēlmes, parādi un uzkrājumi Kā piemēru var ņemt 50/30/20
              sadalījumu
            </div>
          </div>
          <div className="flex-row">
            <Image
              src={fImage2}
              alt="Finance picture 1"
              height={500}
              width={500}
            />
          </div>
        </div>
        <div className="sm:flex items-center justify-between mt-10">
          <div className="flex-row">
            <Image
              src={fImage1}
              alt="Finance picture 1"
              height={500}
              width={500}
            />
          </div>
          <div className="sm:w-1/2 text-3xl text-right leading-9 p-2">
            Finanšu pārvaldība sākotnēji varētu šķist mulsinoša, bet tās
            uzsākšana būs viena no labākajiem lēmumiem jūsu dzīvē! Iedomājies
            nākotni kurā finansiālais stress ir pagātne un kurā droši varat
            īstenot savus finansiālos sapņus.
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
