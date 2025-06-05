"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, KeyRound } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
           <Image 
            src="https://placehold.co/100x100.png" 
            alt="Logo PriceWise Gov" 
            width={80} 
            height={80} 
            className="mx-auto mb-4 rounded-full"
            data-ai-hint="government logo" 
          />
          <CardTitle className="text-3xl font-bold font-headline text-primary">Criar Conta</CardTitle>
          <CardDescription>Junte-se ao PriceWise Gov para otimizar as compras</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="fullName" placeholder="Seu Nome Completo" required className="pl-8" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="usuario@example.gov.br" required className="pl-8" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <KeyRound className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" required className="pl-8" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative">
              <KeyRound className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="confirmPassword" type="password" required className="pl-8" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Cadastrar</Button>
          <p className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
