import { SignUpController } from './signup';

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', () => {
        // SUT - SYSTEM UNDER TEST
        const sut = new SignUpController();
        
        const httpRequest = {
            body: {
                email: "any@email",
                password: "any_p@assw0rd",
                passwordConfirmation: "any_p@assw0rd",
            }
        };

        const httpResponse = sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400)
    });
});
