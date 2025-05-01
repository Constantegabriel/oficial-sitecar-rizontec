
import { useCars } from "@/contexts/CarContext";
import CarCard from "./CarCard";

export default function CarList({ limit }: { limit?: number }) {
  const { filteredCars } = useCars();
  
  const carsToShow = limit 
    ? filteredCars.slice(0, limit)
    : filteredCars;

  if (carsToShow.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">Nenhum carro encontrado</h3>
        <p className="text-muted-foreground">
          Não encontramos carros com os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {carsToShow.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
