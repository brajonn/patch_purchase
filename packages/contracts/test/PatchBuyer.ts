import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
// @ts-ignore
import chaiMatch from "chai-match";
import { ethers as Ethers, Signer } from "ethers";
import { ethers, upgrades } from "hardhat";
import { chainlinkConfig } from "../consts";

chai.use(chaiAsPromised);
chai.use(chaiMatch);

let owner: SignerWithAddress;
let creator: SignerWithAddress;
let deployed: Ethers.Contract;

const transact = async ({
  sender = owner,
  method,
  args = [],
}: {
  sender?: any;
  method: string;
  args?: Array<unknown>;
}) => {
  const tx = await deployed.connect(sender)[method](...args);
  return await tx?.wait();
};

beforeEach(async () => {
  [owner, creator] = await ethers.getSigners();

  const factory = await ethers.getContractFactory("PatchBuyer");

  const { token, oracle } = chainlinkConfig.mumbai;
  const tx = await factory.deploy(token, oracle);
  deployed = await tx.deployed();
});

describe("The Patch Purchaser", () => {
  const project = "Patch's Mineralization Test Offset Project";
  const symbol = "PMP";
  const patchProjectId = "pro_test_9fdc93f66dba9cdfacbceac9f2648a01";
  const ipfs =
    "ipfs://bafybeibh576cyb7xnhifgaxqbndtaphvgontingmfuvg2neewgth2khcsm/metadata.json";
  it.only("should mint OFT in response to carbon purchased", async () => {
    // console.log({ deployed });
    // expect(await deployed.owner()).to.equal(owner.address);

    let tx = await deployed.generateOFT(project, symbol);
    const receipt = await tx.wait();

    tx = await deployed.buy(patchProjectId, { value: 1n * 10n ** 17n });
    console.log("waiting 10 blocks");
    await tx.wait(10);

    // console.log(Buffer.from(ipfs).toString("hex"));
    // // const encoder = new TextEncoder();
    // tx = await deployed.fulfillBytes(
    //   `0x${"0".repeat(64)}`,
    //   `0x${Buffer.from(ipfs).toString("hex")}`,
    //   15,
    //   project
    // );
    // await tx.wait();

    const balance = await deployed["balanceOf(address,string)"](
      owner.address,
      project
    );
    console.log(`balance: ${balance}`);
    expect(Number(balance)).to.be.greaterThan(0);
  }).timeout(5 * 60 * 1000);
  it("shouldnt revert when calling execute buy", async () => {
    // console.log({ deployed });
    // expect(await deployed.owner()).to.equal(owner.address);

    const tx = await deployed.executeBuy(
      1500,
      "Patch's Mineralization Test Offset Project"
    );

    const receipt = await tx.wait();
    //   let event = receipt.events.find(
    //     (evt: Ethers.Event) => evt.event === "Created"
    //   );

    //   expect(event).to.not.be.undefined;

    //   const [createdId, _controller] = event.args;

    //   const [
    //     TYPE_WIDTH,
    //     TYPE_BOUNDARY,
    //     GATING_TYPE,
    //     VANILLA_TYPE,
    //     ROLE_WIDTH,
    //     ROLE_BOUNDARY,
    //     MINTER_ROLE,
    //     CONFIGURER_ROLE,
    //     LIMITER_ROLE,
    //   ] = [
    //     await token.TYPE_WIDTH(),
    //     await token.TYPE_BOUNDARY(),
    //     await token.GATING_TYPE(),
    //     await token.VANILLA_TYPE(),
    //     await token.ROLE_WIDTH(),
    //     await token.ROLE_BOUNDARY(),
    //     await token.roleValueForName("Minter"),
    //     await token.roleValueForName("Configurer"),
    //     await token.roleValueForName("Limiter"),
    //   ].map((val) => BigInt(val));

    //   expect(createdId).to.equal(VANILLA_TYPE + 1n);

    //   expect(await token.typeSupply()).to.equal(4);

    //   const tokens = await Promise.all(
    //     Array.from({ length: 4 }, (_, i) => i).map(async (idx) =>
    //       (await token.tokenByIndex(idx + 1)).toBigInt()
    //     )
    //   );

    //   const vanilla = tokens[0];
    //   const gates = tokens.slice(1);

    //   expect(vanilla).to.equal(createdId);

    //   await Promise.all(
    //     gates.map(async (tkn) => (tkn & (2n ** TYPE_WIDTH - 1n)) === GATING_TYPE)
    //   );

    //   const roles = await Promise.all(
    //     gates.map(async (tkn) => (tkn >> ROLE_BOUNDARY) & (2n ** ROLE_WIDTH - 1n))
    //   );

    //   expect(roles).to.have.members([MINTER_ROLE, CONFIGURER_ROLE, LIMITER_ROLE]);
    // });

    // it("it allows for a Superuser to create tokens.", async () => {
    //   const creatorRole = await token.roleValueForName("Creator");

    //   await expect(
    //     transact({ sender: creator, method: "create()" }),
    //     "attempts to `create()` w/o a Creator token should fail"
    //   ).to.eventually.be.rejected.then((error) => {
    //     expect(error.message).to.match(/must have a Creator token/);
    //   });

    //   await transact({
    //     method: "grantRole(uint8,address)",
    //     args: [creatorRole, creator.address],
    //   });

    //   expect(
    //     await token["hasRole(uint8,address)"](creatorRole, creator.address),
    //     "after a generic role grant, the user will have the role"
    //   ).to.be.true;

    //   expect(
    //     await token.connect(creator)["hasRole(uint8,uint256)"](creatorRole, 1),
    //     "with a generic role grant, specific permissions are granted"
    //   ).to.be.true;

    //   await expect(
    //     transact({ sender: creator, method: "create()" }),
    //     "with a generic Creator token, a user can `create()`"
    //   ).to.eventually.be.fulfilled;

    //   const firstGate = (await token.tokenByIndex(3)).toBigInt();
    //   const minterRole = await token.roleValueForName("Minter");
    //   const minterOfNum2 = (
    //     await token["roleToken(uint8,uint256)"](minterRole, 2)
    //   ).toBigInt();
    //   const internalFlag = (await token.INTERNAL_MASK()).toBigInt();

    //   expect(
    //     firstGate,
    //     "created gating token to be a specific minting permission"
    //   ).to.equal(minterOfNum2 | internalFlag);

    //   const genericMinter = (
    //     await token["roleToken(uint8)"](minterRole)
    //   ).toBigInt();

    //   await transact({
    //     method: "setURI(uint256,string)",
    //     args: [genericMinter, "test"],
    //   });

    //   const minterURI = await token.uri(genericMinter);

    //   expect(minterURI, "generic URI to be set").to.equal("test");

    //   expect(
    //     await token.uri(firstGate),
    //     "specific gating token to return generic URI"
    //   ).to.equal(minterURI);
    // });

    // it("retrieves generic metadata.", async () => {
    //   const minterRole = await token["roleValueForName(string)"]("Minter");
    //   const minterGate = await token["roleToken(uint8)"](minterRole);

    //   await transact({
    //     method: "setURI(uint256,string)",
    //     args: [minterGate, "test"],
    //   });

    //   expect(
    //     await token.uri(minterGate),
    //     "the generic gating token to have the specified URI"
    //   ).to.equal("test");

    //   const specificGate = await token["roleToken(uint8,uint256)"](minterRole, 2);

    //   expect(
    //     specificGate.toBigInt() - minterGate.toBigInt(),
    //     "there to be a difference in the generic & specific token ids"
    //   ).to.equal(2n);

    //   expect(
    //     await token.uri(specificGate),
    //     "the single affect token to have the same URI"
    //   ).to.equal("test");

    //   expect(
    //     await token.typeSupply(),
    //     "the number of token types to be zero"
    //   ).to.equal(0);

    //   expect(
    //     await token["hasRole(uint8,address)"](minterRole, owner.address),
    //     "a user not granted a role not to have it"
    //   ).to.be.false;

    //   const creatorRole = await token["roleValueForName(string)"]("Creator");
    //   const creatorGate = await token["roleToken(uint8)"](creatorRole);

    //   await transact({
    //     method: "grantRole(uint8,address)",
    //     args: [creatorRole, creator.address],
    //   });

    //   expect(
    //     await token.balanceOf(creator.address, creatorGate),
    //     "a user to have a gating token when granted a role"
    //   ).to.equal(1);

    //   expect(
    //     await token["hasRole(uint8,address)"](creatorRole, creator.address),
    //     "a user granted a role to have it"
    //   ).to.be.true;

    //   await transact({ sender: creator, method: "create()" });

    //   await expect(
    //     transact({ sender: creator, method: "create()" }),
    //     "a user with a Creator role to be able to create new types"
    //   ).to.eventually.be.fulfilled;
    // });

    // it("destroys a single use token after use", async () => {
    //   const tx = await token["create()"]();
    //   const receipt = await tx.wait();
    //   let event = receipt.events.find(
    //     (evt: Ethers.Event) => evt.event === "Created"
    //   );

    //   expect(event).to.not.be.undefined;

    //   const [createdId, _controller] = event.args;
    //   const counterMask = await token.COUNTER_MASK();
    //   const tokenIndex = createdId.toBigInt() & counterMask.toBigInt();

    //   expect(tokenIndex).to.equal(1n);

    //   const minterGate = await token.tokenByIndex(2);

    //   await token.burn(owner.address, minterGate, 1);

    //   expect(await token.totalSupply(minterGate)).to.equal(0);

    //   const minterRole = await token.roleValueForName("Minter");
    //   const minterToken = await token["roleToken(uint8,uint256)"](
    //     minterRole,
    //     tokenIndex
    //   );
    //   const singleUse = await token.USE_ONCE();
    //   const singleMinter = minterToken.toBigInt() | singleUse.toBigInt();

    //   await transact({
    //     method: "mint(address,uint256,uint256,bytes)",
    //     args: [creator.address, singleMinter, 1, []],
    //   });

    //   expect(await token.balanceOf(creator.address, singleMinter)).to.equal(1);
    //   expect(
    //     await token["hasRole(uint8,address,uint256)"](
    //       minterRole,
    //       creator.address,
    //       tokenIndex
    //     )
    //   ).to.be.true;

    //   await transact({
    //     sender: creator,
    //     method: "mint(address,uint256,uint256,bytes)",
    //     args: [creator.address, createdId, 10, []],
    //   });

    //   expect(
    //     await token["hasRole(uint8,address,uint256)"](
    //       minterRole,
    //       creator.address,
    //       tokenIndex
    //     )
    //   ).to.be.false;
  });
});
