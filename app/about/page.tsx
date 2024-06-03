import Image from 'next/image';
import Stabini from '../../public/stabini.png';
import Sektori from '../../public/sektors.png';
import Progress from '../../public/progress.png';
const About = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <h1 className="mt-6 text-4xl">Par Mums!</h1>
      <h1 className="mt-4 text-xl">
        Piedāvājam tieši tev uzsākt pārvaldīt savas finanses veicot manuālu datu
        ievadi un analizējot tās stabiņu un sektoru diagrammā
      </h1>

      <div className="max-w-5xl mx-auto flex-col lg:flex-row lg:space-x-5 sm:flex-col">
        <div className="sm:flex items-center justify-between mt-10">
          <div className="sm:w-1/2 text-2xl leading-9 p-2">
            <h1 className="text-4xl">Ienākumi un izdevumi stabiņu diagrammā</h1>
            <div className="mt-4">
              Apskati savus ienākumus un izdevumus stabiņu diagrammā! Katram
              stabiņam pieejams uznirstošais logs detalizētākai informācijai
            </div>
          </div>
          <div className="flex-row">
            <Image
              src={Stabini}
              alt="Stabinu diagramma"
              height={500}
              width={500}
            />
          </div>
        </div>
        <div className="sm:flex items-center justify-between mt-10">
          <div className="flex-row">
            <Image
              src={Sektori}
              alt="Sektoru diagramma"
              height={500}
              width={500}
            />
          </div>

          <div className="sm:w-1/2 text-3xl text-right leading-9 p-2">
            Apskati ienākumus un izdevumus apkopotus pa kategorijām sektoru
            diagrammā! Katram sektoram iespējams aplūkot kopējo summu
            attiecīgajai kategorijai uznirstošajā logā!
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-6">
          <div className="text-3xl text-center">
            Taupīšanas mērķiem un parādiem iespējams apskatīt progresa joslas.
            Progresa joslā iespējams apskatīt procentuālu attēlojumu līdz mērķa
            sasniegšanai
          </div>
          <Image
            src={Progress}
            alt="Progresa joslas"
            height={200}
            width={1000}
            className="mt-4"
          />
        </div>
      </div>
    </div>
  );
};
export default About;
