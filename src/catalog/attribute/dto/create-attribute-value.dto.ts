import { IsNotEmpty, IsString } from "class-validator";

export class AttributeValue {
    value: string;
    code?: string;
    imageUrl?: string;
}

export class CreateAttributeValueDto {
    attributeValues: AttributeValue[];
}
