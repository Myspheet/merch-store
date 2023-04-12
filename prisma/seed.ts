import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const attributes = [
    {
        id: 1,
        attributeName: 'Color',
        attributeCode: 'color'
    },
    {
        id: 2,
        attributeName: 'Size',
        attributeCode: 'size'
    },
    {
        id: 3,
        attributeName: 'Graphics',
        attributeCode: 'graphics'
    }
];

const attributeValue = [
    {
        id: 1,
        value: '2XL',
        code: 'size',
    },
    {
        id: 2,
        value: 'XL',
        code: 'size',
    },
    {
        id: 3,
        value: 'L',
        code: 'size',
    },
    {
        id: 4,
        value: 'M',
        code: 'size',
    },
    {
        id: 5,
        value: 'S',
        code: 'size',
    },
    {
        id: 6,
        value: 'XS',
        code: 'size',
    }
];

const attributeColorValue = [
    {
        id: 7,
        value: 'white',
        code: 'color',
        imageUrl: '/shirts/white.png'
    },
    {
        id: 8,
        value: 'black',
        code: 'color',
        imageUrl: '/shirts/black.png'
    },
    {
        id: 9,
        value: 'blue',
        code: 'color',
        imageUrl: '/shirts/blue.png'
    },
    {
        id: 10,
        value: 'red',
        code: 'color',
        imageUrl: '/shirts/red.png'
    },
    {
        id: 11,
        value: 'yellow',
        code: 'color',
        imageUrl: '/shirts/yellow.png'
    },
    {
        id: 12,
        value: 'purple',
        code: 'color',
        imageUrl: '/shirts/purple.png'
    },
    {
        id: 13,
        value: 'green',
        code: 'color',
        imageUrl: '/shirts/green.png'
    }
];

const attributeGraphicValue = [
    {
        id: 14,
        value: '1',
        code: 'graphics',
        imageUrl: '1.png'
    },
    {
        id: 15,
        value: '2',
        code: 'graphics',
        imageUrl: '2.png'
    },
    {
        id: 16,
        value: '3',
        code: 'graphics',
        imageUrl: '3.png'
    },
    {
        id: 17,
        value: '4',
        code: 'graphics',
        imageUrl: '4.png'
    },
    {
        id: 18,
        value: '5',
        code: 'graphics',
        imageUrl: '5.png'
    },
    {
        id: 19,
        value: '6',
        code: 'graphics',
        imageUrl: '6.png'
    }
];

const products = [
    {
        slug: "first-product",
        name: "First Product",
        price: 15.5,
        sku: "FHKJSH2",
        weight: 2.3,
        discountedPrice: 10,
        quantity: 20,
        variation: [
            {
                attributeId: 1,
                attributeCode: "color",
                attributeValueId: 11
            },
            {
                attributeId: 1,
                attributeCode: "color",
                attributeValueId: 10
            },
            {
                attributeId: 2,
                attributeCode: "size",
                attributeValueId: 1
            }
        ]
    },
    {
        slug: "second-product",
        name: "Second Product",
        price: 20.5,
        sku: "FHKJSH21",
        weight: 2.3,
        discountedPrice: 10,
        quantity: 20,
        variation: [
            {
                attributeId: 1,
                attributeCode: "color",
                attributeValueId: 11
            },
            {
                attributeId: 1,
                attributeCode: "color",
                attributeValueId: 10
            },
            {
                attributeId: 2,
                attributeCode: "size",
                attributeValueId: 2
            }
        ]
    },
    {
        slug: "third-product",
        name: "Third Product",
        price: 25.5,
        sku: "FHKJSH22",
        weight: 2.3,
        discountedPrice: 10,
        quantity: 20,
        variation: [
            {
                attributeId: 1,
                attributeCode: "color",
                attributeValueId: 10
            },
            {
                attributeId: 1,
                attributeCode: "color",
                attributeValueId: 9
            },
            {
                attributeId: 2,
                attributeCode: "size",
                attributeValueId: 3
            }
        ]
    },
    {
        slug: "fourth-product",
        name: "Fourth Product",
        price: 20.5,
        sku: "FHKJSH23",
        weight: 2.3,
        discountedPrice: 10,
        quantity: 20,
        variation: [
            {
                attributeId: 1,
                attributeCode: "color",
                attributeValueId: 11
            },
            {
                attributeId: 1,
                attributeCode: "color",
                attributeValueId: 9
            },
            {
                attributeId: 2,
                attributeCode: "size",
                attributeValueId: 3
            }
        ]
    },
];

const paymentMethods = [
    {
        id: 1,
        name: 'Paypal',
    },
    {
        id: 2,
        name: 'Paystack',
    },
    {
        id: 3,
        name: 'Flutterwave',
    }
];

const users = [
    {
        id: 1,
        email: 'jane@gmail.com',
        name: 'Jane Doe',
    },
    {
        id: 2,
        email: 'john@gmail.com',
        name: 'John Doe',
    }
];

async function main() {
    for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i];
        await prisma.attribute.upsert({
            where: { id: attribute.id },
            update: {},
            create: {
                id: attribute.id,
                attributeName: attribute.attributeName,
                attributeCode: attribute.attributeCode
            }
        });
    }
    // attributes.forEach(async (attribute) => {
    //     await prisma.attribute.upsert({
    //         where: { id: attribute.id },
    //         update: {},
    //         create: {
    //             id: attribute.id,
    //             attributeName: attribute.attributeName,
    //             attributeCode: attribute.attributeCode,
    //             attributeValues: {
    //                 create: attribute.id == 1 ? attributeColorValue : attributeValue
    //             }
    //         }
    //     });
    // });

    for (let i = 0; i < attributeValue.length; i++) {
        const attribute = attributeValue[i];

        await prisma.attributeValue.upsert({
            where: { id: attribute.id },
            update: {},
            create: {
                id: attribute.id,
                code: attribute.code,
                value: attribute.value,
                attributeId: 2
            }
        });
    }

    for (let i = 0; i < attributeColorValue.length; i++) {
        const attribute = attributeColorValue[i]

        await prisma.attributeValue.upsert({
            where: { id: attribute.id },
            update: {},
            create: {
                id: attribute.id,
                code: attribute.code,
                value: attribute.value,
                imageUrl: attribute.imageUrl,
                attributeId: 1
            }
        });
    }

    for (let i = 0; i < attributeGraphicValue.length; i++) {
        const attribute = attributeGraphicValue[i]

        await prisma.attributeValue.upsert({
            where: { id: attribute.id },
            update: {},
            create: {
                id: attribute.id,
                code: attribute.code,
                value: attribute.value,
                imageUrl: attribute.imageUrl,
                attributeId: 3
            }
        });
    }

    for (let i = 0; i < products.length; i++) {
        const attribute = products[i]

        const { variation, ...product } = attribute;
        await prisma.product.upsert({
            where: { slug: attribute.slug },
            update: {},
            create: {
                ...product,
                variations: {
                    create: variation
                }
            }
        });
    }

    for (let i = 0; i < paymentMethods.length; i++) {
        const attribute = paymentMethods[i]

        await prisma.paymentMethod.upsert({
            where: { id: attribute.id },
            update: {},
            create: {
                ...attribute
            }
        });
    }

    for (let i = 0; i < users.length; i++) {
        const attribute = users[i]

        await prisma.user.upsert({
            where: { id: attribute.id },
            update: {},
            create: {
                ...attribute
            }
        });
    }

}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })