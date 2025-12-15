declare global {
  interface Data {
    temperature: number;
    humidity: number;
    light: number;
    motion: boolean;
  }

  interface CardProps {
    title: string;
    value: string;
  }
}

export {};
