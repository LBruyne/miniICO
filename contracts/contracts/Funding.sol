pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract Funding {

    // 参与者
    struct Funder {
        // 构造函数填充
        address payable addr;               // 投资人的地址
        uint    amount;                     // 出资数额
    }

    // 使用请求信息
    struct Use {
        string useDescription;              // 使用说明
        uint   amount;                      // 请求使用的金额
        uint   agreeAmount;                 // 同意的钱，以太坊不太好进行浮点数计算，所以用整形进行表示
        uint   numVote;                     // 投票数量
        bool   isSuccessful;                // 该项目是否成功完成
        mapping (uint => uint) agree;       // 从用户序号到是否同意的状态映射
        // 0 没投过票
        // 1 投票同意
        // 2 投票不同意
    }

    // 项目信息
    struct Campaign {
        // 构造函数填充
        string projectName;                 // 项目名
        string projectDescription;          // 项目描述
        address payable manager;            // 发起者
        uint targetMoney;                   // 目标筹集金额
        uint durTime;                       // 项目结束时间，单位天

        uint startTime;                     // 项目开始时间
        uint endTime;                       // 项目结束时间
        uint collectedMoney;                // 收集到的金额
        uint numFunders;                    // 参与成员的数量
        bool isUsed;                        // 是否被使用过
        bool isSuccessful;                  // 是否众筹成功

        mapping (uint => Funder) funders;   // 参与成员的信息
    }

    uint public numCampaigns;                      // 众筹项目的数量
    mapping (uint => Campaign) public campaigns;   // 众筹项目的信息
    mapping (uint => Use) public uses;             // 因为结构体内嵌不能成功编译，所以将Use单独拿出来

    function newCampaign(string memory name, string memory desc, address payable manager, uint target, uint dur) public
    returns (uint) {
        require(dur > 0);
        // campaignID 作为一个变量返回
        uint campaignID = numCampaigns++;
        campaigns[campaignID] = Campaign({projectName: name,
        projectDescription: desc,
        manager: manager,
        targetMoney: target * 1 ether,
        durTime: dur,
        startTime: now,
        endTime: now + dur * 1 days,
        collectedMoney: 0 * 1 ether,
        numFunders: 0,
        isUsed: false,
        isSuccessful: false
        });
        uses[campaignID] = Use("Please set Use Description.", 0, 0, 0, false);
        return campaignID;
    }

    function contribute(uint campaignID) public payable {
        // ID必须在范围内
        require(campaignID < numCampaigns && campaignID >= 0);
        // 贡献的钱必须大于0，而且不能超过差额
        require(msg.value > 0 && msg.value <= campaigns[campaignID].targetMoney - campaigns[campaignID].collectedMoney);
        // 时间上必须还没结束
        require(campaigns[campaignID].endTime > now);
        // 必须还没有收集成功，这一条和第一条基本上是绑定了的
        require(campaigns[campaignID].isSuccessful == false);

        Campaign storage c = campaigns[campaignID];
        Use storage u = uses[campaignID];
        // 使用权数量增加
        u.agree[c.numFunders] = 0; // 初始为没投票过
        // 投资者数量增加
        c.funders[c.numFunders++] = Funder({addr: msg.sender, amount: msg.value});
        // 已收集的资金增加
        c.collectedMoney += msg.value;

        // 更改是否成功状态
        if(c.collectedMoney >= c.targetMoney)
            c.isSuccessful = true;
        else
            c.isSuccessful = false;
    }

    function setUse(uint campaignID, uint amount, string memory desc) public {
        require(campaignID < numCampaigns && campaignID >= 0);
        require(campaigns[campaignID].isSuccessful == true);
        require(campaigns[campaignID].isUsed == false);
        require(campaigns[campaignID].manager == msg.sender); // 必须是发起者使用
        require(campaigns[campaignID].targetMoney >= amount); // 使用的金额小于总共

        Use storage u = uses[campaignID];
        // 设置use的信息
        u.useDescription = desc;
        u.amount = amount * 1 ether;
    }

    function agreeUse(uint campaignID, bool agree) public {
        Campaign storage c = campaigns[campaignID];
        Use storage u = uses[campaignID];
        require(campaignID < numCampaigns && campaignID >= 0);
        require(c.isSuccessful == true && c.isUsed == false && u.isSuccessful == false);

        for(uint i = 0; i < c.numFunders; i++) {
            // 该用户参与了出资
            if(msg.sender == c.funders[i].addr) {
                require(u.agree[i] == 0);
                if(u.agree[i] == 0) {
                    // 用户同意
                    if(agree == true) {
                        u.agree[i] = 1;
                        u.agreeAmount += c.funders[i].amount;
                    }
                    // 用户不同意
                    else {
                        u.agree[i] = 2;
                    }

                    // 检查此时是否过半
                    if(u.agreeAmount >= c.collectedMoney / 2) {
                        u.isSuccessful = true;
                        // 使用成功，给经理人打钱
                        c.manager.transfer(u.amount);
                        c.isUsed = true;
                    }

                    // 检查此时是不是投票完成
                    if(++u.numVote == c.numFunders) {
                        c.isUsed = true;
                        // 项目失败
                        u.isSuccessful = false;
                    }
                }
            }
        }
    }

    // 检查是否筹集到了对应的金额
    function checkGoalReached(uint campaignID) public view returns (bool) {
        Campaign storage c = campaigns[campaignID];
        return c.isSuccessful;
    }

    // 检查是否被用过了
    function checkCampaignUsed(uint campaignID) public view returns (bool) {
        Campaign storage c = campaigns[campaignID];
        return c.isUsed;
    }

    // 获取筹集到的金额
    function getAmount(uint campaignID) public view returns (uint) {
        Campaign storage c = campaigns[campaignID];
        return c.collectedMoney;
    }

    // 检查一个用户是否在一个项目的支持者名单中
    function checkIsFunder(uint campaignID, address uaddr) public view returns (bool) {
        Campaign storage c = campaigns[campaignID];
        bool ret = false;
        for(uint i = 0; i < c.numFunders; i++) {
            if(c.funders[i].addr == uaddr) {
                ret = true;
                break;
            }
        }
        return ret;
    }

    // 检查一个用户是否对一个项目投票
    function checkIsVoted(uint campaignID, address uaddr) public view returns (bool) {
        Use storage u = uses[campaignID];
        Campaign storage c = campaigns[campaignID];
        bool ret = false;
        for(uint i = 0; i < c.numFunders; i++) {
            if(c.funders[i].addr == uaddr) {
                if(u.agree[i] != 0) {
                    ret = true;
                    break;
                }
            }
        }
        return ret;
    }

    /* 获取所有参与者
    function getInvestors(uint campaignID) public returns(address[] memory) {
        Campaign storage c = campaigns[campaignID];
        address[] funders;
        for(uint i = 0; i < c.numFunders; i++) {
            funders[i] = c.funders[i].addr;
        }
        return funders;
    }
    */

    /* 退款
    function refund(uint campaignID) public {
        Campaign c = campaigns[campaignID];
        for (uint i = 0; i < c.numFunders; i++) {
            c.funders[i].transfer(c.funders[i].amount);
        }
    }
    */
}
