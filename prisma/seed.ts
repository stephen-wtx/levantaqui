import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../app/generated/prisma/client';
import {
  EstadoATM,
  EstadoServico,
  TipoServico,
  DiaSemana,
} from '../app/generated/prisma/enums';
import argon2 from 'argon2';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const DIAS_UTEIS = [
  DiaSemana.SEGUNDA,
  DiaSemana.TERCA,
  DiaSemana.QUARTA,
  DiaSemana.QUINTA,
  DiaSemana.SEXTA,
];



const branches = [
  {
    nome: 'Alto-Gingone',
    codigo: 'ALTO_GINGONE',
    referenceLocation: 'Av. 1º de Maio, próx. ao Mercado Central',
    username: 'admin.alto.gingone',
    atms: [
      {
        numero: 1,
        code: 'ATM-AG-01',
        label: 'Caixa 01',
        locationDetails: 'Fachada principal da agência',
        estado: EstadoATM.DISPONIVEL,
      },
      {
        numero: 2,
        code: 'ATM-AG-02',
        label: 'Caixa 02',
        locationDetails: 'Fachada principal da agência',
        estado: EstadoATM.DISPONIVEL,
      },
      {
        numero: 3,
        code: 'ATM-AG-03',
        label: 'Caixa 03',
        locationDetails: 'Área interior de autoatendimento',
        estado: EstadoATM.DISPONIVEL,
      },
      {
        numero: 4,
        code: 'ATM-AG-04',
        label: 'Caixa 04',
        locationDetails: 'Área interior de autoatendimento',
        estado: EstadoATM.MANUTENCAO,
      },
    ],
    depositService: {
      estado: EstadoServico.ABERTO,
      openingTime: '08:00',
      closingTime: '15:30',
    },
    customerService: {
      estado: EstadoServico.ABERTO,
      openingTime: '08:00',
      closingTime: '15:30',
    },
  },

  {
    nome: 'Cariacó',
    codigo: 'CARIACO',
    referenceLocation: 'Estrada Nacional nº 1, Rotunda do Cariacó',
    username: 'admin.cariaco',
    atms: [
      {
        numero: 1,
        code: 'ATM-CR-01',
        label: 'Caixa 01 (Exterior)',
        locationDetails: 'Entrada da agência',
        estado: EstadoATM.DISPONIVEL,
      },
      {
        numero: 2,
        code: 'ATM-CR-02',
        label: 'Caixa 02',
        locationDetails: 'Entrada da agência',
        estado: EstadoATM.INDISPONIVEL,
      },
    ],
    depositService: {
      estado: EstadoServico.FECHADO,
      openingTime: '08:00',
      closingTime: '15:00',
    },
    customerService: {
      estado: EstadoServico.ABERTO,
      openingTime: '08:00',
      closingTime: '15:30',
    },
  },

  {
    nome: 'Centro da Cidade',
    codigo: 'CENTRO_CIDADE',
    referenceLocation: 'Av. Eduardo Mondlane, Edifício Comercial',
    username: 'admin.centro.cidade',
    atms: [
      {
        numero: 1,
        code: 'ATM-CC-01',
        label: 'Caixa 01',
        locationDetails: 'Hall de entrada da agência',
        estado: EstadoATM.DISPONIVEL,
      },
      {
        numero: 2,
        code: 'ATM-CC-02',
        label: 'Caixa 02',
        locationDetails: 'Hall de entrada da agência',
        estado: EstadoATM.DISPONIVEL,
      },
      {
        numero: 3,
        code: 'ATM-CC-03',
        label: 'Caixa 03',
        locationDetails: 'Fachada virada para a Av. Principal',
        estado: EstadoATM.DISPONIVEL,
      },
      {
        numero: 4,
        code: 'ATM-CC-04',
        label: 'Caixa 04',
        locationDetails: 'Fachada virada para a Av. Principal',
        estado: EstadoATM.DISPONIVEL,
      },
      {
        numero: 5,
        code: 'ATM-CC-05',
        label: 'Caixa 05',
        locationDetails: 'Lateral do edifício comercial',
        estado: EstadoATM.INDISPONIVEL,
      },
    ],
    depositService: {
      estado: EstadoServico.ABERTO,
      openingTime: '08:00',
      closingTime: '15:30',
    },
    customerService: {
      estado: EstadoServico.ABERTO,
      openingTime: '08:00',
      closingTime: '16:00',
    },
  },
];

async function main() {
  console.log('A iniciar seed da base de dados...');

  const defaultPassword = process.env.SEED_DEFAULT_PASSWORD;
  if (!defaultPassword) {
    throw new Error(
      'SEED_DEFAULT_PASSWORD não está definida no ficheiro .env',
    );
  }

  const passwordHash = await argon2.hash(defaultPassword);

  for (const branch of branches) {
    const filial = await prisma.filial.upsert({
      where: {
        codigo: branch.codigo,
      },
      update: {
        nome: branch.nome,
        referenceLocation: branch.referenceLocation,
      },
      create: {
        nome: branch.nome,
        codigo: branch.codigo,
        referenceLocation: branch.referenceLocation,
      },
    });

    await prisma.utilizador.upsert({
      where: {
        username: branch.username,
      },
      update: {
        nome: `Administrador ${branch.nome}`,
        passwordHash,
        filialId: filial.id,
      },
      create: {
        nome: `Administrador ${branch.nome}`,
        username: branch.username,
        passwordHash,
        filialId: filial.id,
      },
    });

    for (const atm of branch.atms) {
      await prisma.aTM.upsert({
        where: {
          code: atm.code,
        },
        update: {
          numero: atm.numero,
          label: atm.label,
          locationDetails: atm.locationDetails,
          estado: atm.estado,
          filialId: filial.id,
        },
        create: {
          numero: atm.numero,
          code: atm.code,
          label: atm.label,
          locationDetails: atm.locationDetails,
          estado: atm.estado,
          filialId: filial.id,
        },
      });
    }

    const services = [
      {
        tipo: TipoServico.DEPOSITOS,
        estado: branch.depositService.estado,
        openingTime: branch.depositService.openingTime,
        closingTime: branch.depositService.closingTime,
      },
      {
        tipo: TipoServico.ATENDIMENTO,
        estado: branch.customerService.estado,
        openingTime: branch.customerService.openingTime,
        closingTime: branch.customerService.closingTime,
      },
    ];

    for (const service of services) {
      const servico = await prisma.servico.upsert({
        where: {
          filialId_tipo: {
            filialId: filial.id,
            tipo: service.tipo,
          },
        },
        update: {
          estado: service.estado,
        },
        create: {
          filialId: filial.id,
          tipo: service.tipo,
          estado: service.estado,
        },
      });

      for (const diaSemana of DIAS_UTEIS) {
        await prisma.horario.upsert({
          where: {
            servicoId_diaSemana: {
              servicoId: servico.id,
              diaSemana,
            },
          },
          update: {
            horaAbertura: service.openingTime,
            horaFecho: service.closingTime,
          },
          create: {
            servicoId: servico.id,
            diaSemana,
            horaAbertura: service.openingTime,
            horaFecho: service.closingTime,
          },
        });
      }
    }

    console.log(`✓ ${branch.nome}`);
  }

  console.log('Seed concluído com sucesso.');
}

main()
  .catch((error) => {
    console.error('Erro durante o seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });