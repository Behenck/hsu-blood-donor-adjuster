"use client"
import { AdjusterForm, Button, Copyright, Form, FormControl, Input, Main, Select, Window } from "./styles"
import Image from 'next/image'
import WomanBloodBankImage from '../assets/image.jpg'
import { api } from "@/services/api"
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from "react"
import { toast, Toaster } from "react-hot-toast"

interface Donor {
  doador: string
  registro: string
  sexo: "M" | "F"
}

const UpdateBloodDonorFormSchema = z.object({
  donor: z.string().min(9).max(9),
})

type UpdateBloodDonorFormInputs = z.infer<typeof UpdateBloodDonorFormSchema>

export default function Home() {
  const [donor, setDonor] = useState<Donor>({} as Donor)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<UpdateBloodDonorFormInputs>({
    resolver: zodResolver(UpdateBloodDonorFormSchema),
  })

  async function handleUpdateBloodDonor(data: UpdateBloodDonorFormInputs) {
    const { donor: register } = data

    try {
      await api.post('/updateBloodDonor', {
        donor: register,
        genre: donor.sexo
      })
     
      reset()
      setDonor({
        doador: "",
        registro: "",
        sexo: "M"
      })
      toast.success("Dados atualizados com sucesso!")

    } catch (err) {
      console.log(err)
      toast.error("Não foi possível atualizar!")
    }
  }

  async function handleFindByDonor(value: string) {
    const res = await api.post('/findByDonor', {
      donor: value,
    })
    
    !res.data[0] ? setDonor({
      doador: "Não Encontrado",
      registro: "0",
      sexo: "M",
    }) : setDonor(res.data[0])
  }

  return (
    <Main>
      <Toaster />
      <Window>
        <div>
          <Image src={WomanBloodBankImage} alt="image" width={500} height={500} />
        </div>
        <AdjusterForm>
          <h1>Mudar dia doador</h1>

          <Form onSubmit={handleSubmit(handleUpdateBloodDonor)}>
            <FormControl>
              <label htmlFor="donor">Doador</label>
              <Input id="donor" type="text" {...register("donor")} onBlur={(e) => handleFindByDonor(e.target.value)} />
            </FormControl>

            <FormControl>
              <label htmlFor="name">Nome</label>
              <Input type="text" disabled value={donor.doador ? donor.doador : ''} />
            </FormControl>

            <Button type="submit" disabled={donor.registro === "0"}>Salvar</Button>
          </Form>
        </AdjusterForm>
      </Window>

      <Copyright>
        <p>Copyright © 2023 • Denilson Behenck • Todos os direitos reservados</p>
      </Copyright>
    </Main>
  )
}