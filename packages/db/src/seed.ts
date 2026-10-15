import { db } from "./index";

const hours = (count: number) => new Date(Date.now() + count * 60 * 60 * 1000);

const pickupCode = () => Math.floor(1000 + Math.random() * 9000).toString();

async function main() {
  await db.claim.deleteMany();
  await db.listing.deleteMany();
  await db.user.deleteMany();

  const passwordHash = await Bun.password.hash("password123");

  const [bakery, bistro, grocer] = await Promise.all([
    db.user.create({
      data: {
        name: "Ana Ribeiro",
        email: "ana@crumbandco.com",
        passwordHash,
        role: "DONOR",
        organization: "Crumb & Co. Bakery",
        city: "Bengaluru",
      },
    }),
    db.user.create({
      data: {
        name: "Rohit Mehra",
        email: "rohit@tamarindbistro.com",
        passwordHash,
        role: "DONOR",
        organization: "Tamarind Bistro",
        city: "Bengaluru",
      },
    }),
    db.user.create({
      data: {
        name: "Meera Iyer",
        email: "meera@greenbasket.in",
        passwordHash,
        role: "DONOR",
        organization: "Green Basket Grocers",
        city: "Mumbai",
      },
    }),
  ]);

  const [shelter, fridge] = await Promise.all([
    db.user.create({
      data: {
        name: "Kabir Shah",
        email: "kabir@hopekitchen.org",
        passwordHash,
        role: "RECEIVER",
        organization: "Hope Community Kitchen",
        city: "Bengaluru",
      },
    }),
    db.user.create({
      data: {
        name: "Sara Thomas",
        email: "sara@communityfridge.org",
        passwordHash,
        role: "RECEIVER",
        organization: "Community Fridge Network",
        city: "Mumbai",
      },
    }),
  ]);

  await db.listing.createMany({
    data: [
      {
        title: "Sourdough loaves & focaccia",
        description: "Baked this morning. Perfect for toast or sandwiches through tomorrow.",
        category: "BAKERY",
        quantity: 18,
        unit: "items",
        weightKg: 9,
        pickupAddress: "12 Church Street, Ashok Nagar",
        city: "Bengaluru",
        availableUntil: hours(5),
        donorId: bakery.id,
      },
      {
        title: "Vegetable biryani trays",
        description: "Surplus from a cancelled catering order. Sealed and refrigerated.",
        category: "PREPARED",
        quantity: 40,
        unit: "portions",
        weightKg: 14,
        pickupAddress: "88 Indiranagar 100ft Road",
        city: "Bengaluru",
        availableUntil: hours(3),
        donorId: bistro.id,
      },
      {
        title: "Ripe bananas and papayas",
        description: "Cosmetically imperfect but sweet. Great for smoothies.",
        category: "PRODUCE",
        quantity: 25,
        unit: "kg",
        weightKg: 25,
        pickupAddress: "4 Linking Road, Bandra West",
        city: "Mumbai",
        availableUntil: hours(20),
        donorId: grocer.id,
      },
      {
        title: "Greek yoghurt tubs",
        description: "Best before in two days. Kept cold at 4°C.",
        category: "DAIRY",
        quantity: 30,
        unit: "items",
        weightKg: 12,
        pickupAddress: "4 Linking Road, Bandra West",
        city: "Mumbai",
        availableUntil: hours(30),
        donorId: grocer.id,
      },
      {
        title: "Rice, lentils and pasta",
        description: "Dented packaging, contents untouched.",
        category: "PANTRY",
        quantity: 6,
        unit: "boxes",
        weightKg: 22,
        pickupAddress: "88 Indiranagar 100ft Road",
        city: "Bengaluru",
        availableUntil: hours(48),
        donorId: bistro.id,
      },
      {
        title: "Croissants and cinnamon buns",
        description: "End of day pastries, boxed and ready.",
        category: "BAKERY",
        quantity: 24,
        unit: "items",
        weightKg: 3.5,
        pickupAddress: "12 Church Street, Ashok Nagar",
        city: "Bengaluru",
        availableUntil: hours(8),
        donorId: bakery.id,
      },
    ],
  });

  const history = await db.listing.create({
    data: {
      title: "Paneer curry and rotis",
      description: "Lunch service surplus.",
      category: "PREPARED",
      quantity: 35,
      unit: "portions",
      weightKg: 12,
      pickupAddress: "88 Indiranagar 100ft Road",
      city: "Bengaluru",
      availableUntil: hours(-20),
      status: "COLLECTED",
      donorId: bistro.id,
    },
  });

  await db.claim.create({
    data: {
      listingId: history.id,
      receiverId: shelter.id,
      status: "COLLECTED",
      pickupCode: pickupCode(),
      collectedAt: hours(-22),
    },
  });

  const reserved = await db.listing.create({
    data: {
      title: "Mixed salad greens",
      description: "Washed and bagged.",
      category: "PRODUCE",
      quantity: 8,
      unit: "kg",
      weightKg: 8,
      pickupAddress: "4 Linking Road, Bandra West",
      city: "Mumbai",
      availableUntil: hours(6),
      status: "RESERVED",
      donorId: grocer.id,
    },
  });

  await db.claim.create({
    data: {
      listingId: reserved.id,
      receiverId: fridge.id,
      pickupCode: pickupCode(),
    },
  });

  console.log("Seeded demo data. Every account uses the password: password123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
