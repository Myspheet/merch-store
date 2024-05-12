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
    }
];

const attributeValue = [
    {
        value: '2XL',
        code: 'size',
    },
    {
        value: 'XL',
        code: 'size',
    },
    {
        value: 'L',
        code: 'size',
    },
    {
        value: 'M',
        code: 'size',
    },
    {
        value: 'S',
        code: 'size',
    },
    {
        value: 'XS',
        code: 'size',
    }
];

const attributeColorValue = [
    {
        value: 'red',
        code: 'color',
    },
    {
        value: 'blue',
        code: 'color',
    },
    {
        value: 'green',
        code: 'color',
    },
    {
        value: 'yellow',
        code: 'color',
    },
    {
        value: 'brown',
        code: 'color',
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
                attributeValueId: 1
            },
            {
                attributeId: 1,
                attributeCode: "color",
                attributeValueId: 2
            },
            {
                attributeId: 2,
                attributeCode: "size",
                attributeValueId: 9
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
                attributeValueId: 1
            },
            {
                attributeId: 1,
                attributeCode: "color",
                attributeValueId: 2
            },
            {
                attributeId: 2,
                attributeCode: "size",
                attributeValueId: 9
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
                attributeValueId: 1
            },
            {
                attributeId: 1,
                attributeCode: "color",
                attributeValueId: 2
            },
            {
                attributeId: 2,
                attributeCode: "size",
                attributeValueId: 9
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
                attributeValueId: 1
            },
            {
                attributeId: 1,
                attributeCode: "color",
                attributeValueId: 2
            },
            {
                attributeId: 2,
                attributeCode: "size",
                attributeValueId: 9
            }
        ]
    },
];

async function main() {
    attributes.forEach(async (attribute) => {
        await prisma.attribute.upsert({
            where: { id: attribute.id },
            update: {},
            create: {
                id: attribute.id,
                attributeName: attribute.attributeName,
                attributeCode: attribute.attributeCode,
                attributeValues: {
                    create: attribute.id == 1 ? attributeColorValue : attributeValue
                }
            }
        });
    });

    products.forEach(async (attribute) => {
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
    });

    // attributeValue.forEach(async (attribute) => {
    //     await prisma.attributeValue.upsert({
    //         where: { id: attribute.id },
    //         update: {},
    //         create: {
    //             id: attribute.id,
    //             code: attribute.code,
    //             value: attribute.value,
    //             attributeId: attribute.attributeId
    //         }
    //     });
    // });
}

// main()
//     .then(async () => {
//         await prisma.$disconnect()
//     })
//     .catch(async (e) => {
//         console.error(e)
//         await prisma.$disconnect()
//         process.exit(1)
//     })