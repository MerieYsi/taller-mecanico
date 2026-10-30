import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Mecanico = {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  especialidad: string;
  email: string;
  password: string;
};
type Vehiculo = { id: number; mecanicoId: number; marca: string; modelo: string; patente: string; foto?: string };

type Store = {
  mecanicoActual: Mecanico | null;
  mecanicos: Mecanico[];
  vehiculos: Vehiculo[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  registrarMecanico: (m: Omit<Mecanico, 'id'>) => 'ok' | 'email_repetido' | 'dni_repetido';
  agregarVehiculo: (v: Omit<Vehiculo, 'id' | 'mecanicoId'>) => void;
  editarVehiculo: (id: number, datos: Omit<Vehiculo, 'id' | 'mecanicoId'>) => void;
  eliminarVehiculo: (id: number) => void;
};

export const useTallerStore = create<Store>()(
  persist(
    (set, get) => ({
      mecanicoActual: null,
      mecanicos: [
        {
          id: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          dni: '30123456',
          telefono: '3511234567',
          especialidad: 'Motor',
          email: 'juan@taller.com',
          password: '123456',
        },
      ],
      vehiculos: [],

      login: (email, password) => {
        const m = get().mecanicos.find(
          (x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password
        );
        if (m) set({ mecanicoActual: m });
        return !!m;
      },

      logout: () => set({ mecanicoActual: null }),

      registrarMecanico: (m) => {
        const { mecanicos } = get();
        if (mecanicos.some((x) => x.email.toLowerCase() === m.email.trim().toLowerCase())) {
          return 'email_repetido';
        }
        if (mecanicos.some((x) => x.dni === m.dni)) return 'dni_repetido';
        set({
          mecanicos: [...mecanicos, { ...m, email: m.email.trim(), id: Date.now() }],
        });
        return 'ok';
      },

      agregarVehiculo: (v) => {
  const actual = get().mecanicoActual;
  if (!actual) return;
  set((s) => ({
    vehiculos: [...s.vehiculos, { ...v, id: Date.now(), mecanicoId: actual.id }],
  }));
},

      editarVehiculo: (id, datos) =>
        set((s) => ({
          vehiculos: s.vehiculos.map((v) => (v.id === id ? { ...v, ...datos } : v)),
        })),

      eliminarVehiculo: (id) =>
        set((s) => ({ vehiculos: s.vehiculos.filter((v) => v.id !== id) })),
    }),
    {
      name: 'taller-storage-v3',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ mecanicos: s.mecanicos, vehiculos: s.vehiculos }),
    }
  )
);