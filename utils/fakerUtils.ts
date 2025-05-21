import {faker} from "@faker-js/faker";


export class FakerData {

    static getFirstName():string{
        return faker.person.firstName();
    }

    static getLastName():string{
        return faker.person.lastName();
    }

    static getMobileNumber():string{
        return getPhoneNumber();
    }

    static getEmail():string{
        return faker.internet.email();
    }

    static getAddress():string{
        return faker.location.streetAddress();
    }

    static getAccountNumber():string{
        return faker.finance.accountNumber(11)
    }
    
    static companyName():string{
        return faker.person.jobTitle();
    }
    static getCourseName():string{
        const adjective = faker.hacker.adjective();
        const noun = faker.hacker.noun();
        const verb = faker.hacker.verb();
        return `${capitalizeFirstLetter(adjective)} ${capitalizeFirstLetter(noun)} ${capitalizeFirstLetter(verb)}`;
    }

    static title():string{
       return faker.company.buzzPhrase()
    }

    static getUserNumber():string {
        const currentDate = new Date();
        const milliseconds = currentDate.getTime().toString();
        return milliseconds;
    }
    
    
}

function capitalizeFirstLetter(value:string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function getPhoneNumber(): string {
    const startDigit = Math.floor(Math.random() * 3) + 7;
    const restDigits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
    return `${startDigit}${restDigits}`;
}

