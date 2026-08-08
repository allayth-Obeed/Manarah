import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface LocationSeed {
  subRegionId: string;
  subRegionName: string;
  locations: string[];
}

interface RegionSeed {
  regionId: string;
  regionName: string;
  subRegions: LocationSeed[];
}

interface ProvinceSeed {
  provinceId: string;
  provinceName: string;
  regions: RegionSeed[];
}

// بذر تراتبية جغرافية واحدة (محافظة → منطقة → منطقة فرعية → موقع) بشكل idempotent عبر upsert بالـ code/name
async function seedProvince(data: ProvinceSeed) {
  const province = await prisma.province.upsert({
    where: { code: data.provinceId },
    update: { name: data.provinceName },
    create: { code: data.provinceId, name: data.provinceName },
  });

  for (const regionData of data.regions) {
    const region = await prisma.region.upsert({
      where: { code: regionData.regionId },
      update: { name: regionData.regionName, provinceId: province.id },
      create: { code: regionData.regionId, name: regionData.regionName, provinceId: province.id },
    });

    for (const subRegionData of regionData.subRegions) {
      const subRegion = await prisma.subRegion.upsert({
        where: { code: subRegionData.subRegionId },
        update: { name: subRegionData.subRegionName, regionId: region.id },
        create: { code: subRegionData.subRegionId, name: subRegionData.subRegionName, regionId: region.id },
      });

      for (const locationName of subRegionData.locations) {
        await prisma.location.upsert({
          where: { subRegionId_name: { subRegionId: subRegion.id, name: locationName } },
          update: {},
          create: { name: locationName, subRegionId: subRegion.id },
        });
      }
    }
  }

  console.log(`تم بذر محافظة ${data.provinceName} (${data.regions.length} منطقة)`);
}

async function main() {
  const filePath = path.join(__dirname, 'data', 'syria-regions.json');
  const provinces: ProvinceSeed[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  for (const province of provinces) {
    await seedProvince(province);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
