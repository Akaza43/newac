"use client";
import Container from "../container/page";
import { Data } from "../container/data";

export default function CryptoSpotTrading() {
  const currentId = "15";
  const nextModuleData = Data.find(item => item.id === "16");
  
  return <Container searchParams={{ id: currentId, next: nextModuleData?.link }} />;
}
