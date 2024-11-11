/**
 * Created by ashbas on 11/10/24.
 */

@IsTest
private class PartsReturnTest {
    @TestSetup
    static void setup() {

        Account acc = new Account(Name = 'Test Account');
        insert acc;

        Order order1 = new Order();
        order1.Type = 'Part';
        order1.Name = 'LAPTOP123';
        order1.AccountId = acc.Id;
        order1.EffectiveDate = Date.today();
        order1.Status = 'Draft';
        insert order1;

        Order order2 = new Order();
        order2.Type = 'Part';
        order2.Name = 'LAPTOP123';
        order2.AccountId = acc.Id;
        order2.EffectiveDate = Date.today();
        order2.Status = 'Draft';
        insert order2;

        Order order3 = new Order();
        order3.Type = 'Part';
        order3.Name = 'LAPTOP123';
        order3.AccountId = acc.Id;
        order3.EffectiveDate = Date.today();
        order3.Status = 'Draft';
        insert order3;

        Order order4 = new Order();
        order4.Type = 'Part';
        order4.Name = 'LAPTOP123';
        order4.AccountId = acc.Id;
        order4.EffectiveDate = Date.today();
        order4.Status = 'Draft';
        insert order4;

        Order order5 = new Order();
        order5.Type = 'Returned';
        order5.Name = 'LAPTOP123';
        order5.AccountId = acc.Id;
        order5.EffectiveDate = Date.today();
        order5.Status = 'Draft';
        insert order5;

        Order order7 = new Order();
        order7.Type = 'Part';
        order7.Name = 'BAG567';
        order7.AccountId = acc.Id;
        order7.EffectiveDate = Date.today();
        order7.Status = 'Draft';
        insert order7;

        Order order8 = new Order();
        order8.Type = 'Returned';
        order8.Name = 'BAG567';
        order8.AccountId = acc.Id;
        order8.EffectiveDate = Date.today();
        order8.Status = 'Draft';
        insert order8;
    }

    @IsTest
    public static void testBehavior() {
        List<String> skuList = new List<String>{'LAPTOP123', 'BAG567'};

        Map<String, Integer> returnableParts = PartsReturn.calculateReturnable(skuList);
        Map<String, Integer > expectedReturnableParts = new Map<String, Integer> {

                'LAPTOP123' => 3,
                'BAG567' => 0
        };
        System.assertEquals(expectedReturnableParts,returnableParts, 'Returnable parts value do not match');

    }
}