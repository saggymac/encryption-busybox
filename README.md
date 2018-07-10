# encryption-busybox

-   Encryption BusyBox is a simple tool that demonstrates encryption libraries for creating JSON Web Tokens
-   It can be used locally, run inside a docker container or deployed in a scalable fashion inside Kubernetes

## A simple realistic usage of the encryption-busybox APIs to learn about JWT, JWS, JWE, JWA, and JWK standards by creating a JWE

    1.  Generate Signing Key pair (POST '/encryption/key-pairs' with parameters describing the type of key you would like generated)
    2.  Create a JSON Web Token that you are interested in Signing

              {
                "iss": "https://api.capitalone.com/",
                "sub": "Unique_Identifier_For_User",
                "aud": "Audience i.e. intended Token Recipient",
                "exp": "1541244893",
                "nbf": "1531244893",
                "iat": "1531244872",
                "jti": "0123456789",
                "custom claim": "Sensitive customer information that the requestor wanted"
              }

    3.  Sign the JWT to create a JWS (POST '/signature' with the key and JWT that you would like to be signed)
    4.  Generate an Encryption key for creating the JWE (POST '/encryption/key-pairs' with parameters describing the type of key you would like generated)
    5.  Create a JWE (POST '/ciphertext' with the key, payload and parameters describing the type of JWE that you would like generated)

## The JWE can be decrypted and verified with these steps

    1.  Decrypt the JWE (POST '/plaintext' with the JWE, and the key to decrypt the JWE)
    2.  Verify the signature on the JWS (POST '/verification' with the JWS and the public portion of the signing key)
    3.  Use the JWT data

## Modes of operation

    1. localhost REDIS - The API looks for a REDIS instance on localhost and stores keys there. Multiple API containers can be used to scale the encryption busybox for many users
    2. REDIS Server - The API will look for a server named redis and store keys there.
    3. Standalone - The API creates an keystore in local memory and keys are only stored that were created on the local machine

### Notes

    * The API automatically cycles through the Modes of operation above. It tries each REDIS location 5 times before falling back to standalone mode.
    * The API has been tested with REDIS 3 and REDIS 4
    * Additionally it has been tested with a compatible REDIS implementation called YugaByte DB https://www.yugabyte.com/
    * A Kubernetes deployment can be made up of any number of API pods and a storage service

## **Available API Endpoints:**

    The Encryption-Busybox has the following endpoints

    * GET  '/whereAmI'               - Displays information about local server and environment.
    * GET  '/encryption/public-keys' - Returns all of the public keys in the key store.
    * GET  '/encryption/key-pairs'   - Returns both the public and private key pairs in the key store.
    * POST '/encryption/key-pairs'   - Creates a keypair, stores it in the key store and then returns it.
    * POST '/algorithms/hkdf'        - Expands the supplied key material and derives a key from it.
    * POST '/plaintext'              - Decrypts a JWE and returns the plain text contents.
    * POST '/ciphertext'             - Encrypts the supplied plain text and creates a JWE.
    * POST '/signature'              - Creates a JWS from the supplied message.
    * POST '/verification'           - Checks if a signature is valid.

## Creating the Docker container

    1.  Clone the repo
    2.  Change directories into the cloned directory
    3.  npm install
    4.  npm install -g pkg
    5.  pkg . --output docker/encryption-busybox-linux
    6.  cd docker
    7.  docker build -t <your_container_name> .
    8.  docker run -d -p 3000:3000 <your_container_name>
    9.  Test APIs with curl, Postman or other tool of choice
    10. docker tag <your_container_name> <your_user_ID>/<your_container_name>:<your_version>
    11. docker push <your_user_ID>/<your_container_name>:<your_version>
