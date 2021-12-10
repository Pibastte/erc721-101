pragma solidity ^0.6.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract ExerciceSolution is ERC721
{
    uint actualIdx;

    mapping(address => bool) public breeders;
    mapping(uint => bool) public onAuction;
    mapping(uint => uint) public prices;

    mapping(uint => string) public names;
    mapping(uint => uint) public legs;
    mapping(uint => uint) public sex;
    mapping(uint => bool) public wings;

	constructor (string memory name_, string memory symbol_) public ERC721(name_, symbol_)
    {
        actualIdx = 0;
    }

    function mint(address _to) public {
        actualIdx += 1;
        _mint(_to, actualIdx);
    }

    function mintAndPutForSale(address _to) public {
        actualIdx += 1;
        _mint(_to, actualIdx);
        onAuction[actualIdx] = true;
        prices[actualIdx] = 100;
    }

    function getActualIdx() external view returns (uint256) {
        return actualIdx;
    }

	function isBreeder(address account) external returns (bool) {
        return breeders[msg.sender];
    }

    function registrationPrice() external returns (uint256) {
        return 100;
    }

    function registerMeAsBreeder() external payable {
        breeders[msg.sender] = true;
    }

    function declareAnimalToOwner(address owner, uint256 sex_, uint256 legs_, bool wings_, string calldata name_) external returns (uint256) {
        mint(owner);

        sex[actualIdx] = sex_;
        legs[actualIdx] = legs_;
        wings[actualIdx] = wings_;
        names[actualIdx] = name_;

        return actualIdx;
    }

    function declareAnimal(uint256 sex_, uint256 legs_, bool wings_, string calldata name_) external returns (uint256) {
        mint(msg.sender);

        sex[actualIdx] = sex_;
        legs[actualIdx] = legs_;
        wings[actualIdx] = wings_;
        names[actualIdx] = name_;

        return actualIdx;
    }

    function getAnimalCharacteristics(uint animalNumber) external returns (string memory _name, bool _wings, uint _legs, uint _sex) {
        _name = names[animalNumber];
        _wings = wings[animalNumber];
        _legs = legs[animalNumber];
        _sex = sex[animalNumber];
    }

	function declareDeadAnimal(uint animalNumber) external {
        require(ownerOf(animalNumber) == msg.sender);
        _burn(animalNumber);
        delete names[animalNumber];
        delete legs[animalNumber];
        delete sex[animalNumber];
        delete wings[animalNumber];
    }

	// Selling functions
	function isAnimalForSale(uint animalNumbregistrationPriceer) external view returns (bool) {
        return onAuction[animalNumbregistrationPriceer];
    }

	function animalPrice(uint animalNumber) external view returns (uint256) {
        return prices[animalNumber];
    }

	function buyAnimal(uint animalNumber) external payable {
        require(onAuction[animalNumber], "not on auction");
        transferFrom(ownerOf(animalNumber), msg.sender, animalNumber);
    }

	function offerForSale(uint animalNumber, uint price) external {
        require(ownerOf(animalNumber) == msg.sender);
        onAuction[animalNumber] = true;
        prices[animalNumber] = price;
    }

	// Reproduction functions

	// function declareAnimalWithParents(uint256 sex, uint256 legs, bool wings, string calldata name, uint parent1, uint parent2) external returns (uint256) {
    //     return 3;
    // }

	// function getParents(uint animalNumber) external returns (uint256, uint256) {
    //     return (1,2);
    // }

	// function canReproduce(uint animalNumber) external returns (bool) {
    //     return true;
    // }

	// function reproductionPrice(uint animalNumber) external view returns (uint256) {
    //     return 5;
    // }

	// function offerForReproduction(uint animalNumber, uint priceOfReproduction) external returns (uint256) {
    //     return 1;
    // }

	// function authorizedBreederToReproduce(uint animalNumber) external returns (address) {
    //     return msg.sender;
    // }

	// function payForReproduction(uint animalNumber) external payable {
        
    // }


	
}
