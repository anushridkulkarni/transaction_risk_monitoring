package com.surveillance.engine.rules;

import com.surveillance.engine.model.Transaction;
import org.jeasy.rules.api.Facts;
import org.jeasy.rules.api.Rules;
import org.jeasy.rules.api.RulesEngine;
import org.jeasy.rules.core.DefaultRulesEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RuleEngineService {

    @Autowired
    private HighAmountRule highAmountRule;

    @Autowired
    private WithdrawalRule withdrawalRule;

    @Autowired
    private SameAccountRule sameAccountRule;

    @Autowired
    private InternationalRule internationalRule;

    @Autowired
    private LateNightRule lateNightRule;

    public void evaluate(Transaction transaction) {
        // Reset risk score
        transaction.setRiskScore(0);

        // Set up facts
        Facts facts = new Facts();
        facts.put("transaction", transaction);

        // Set up rules
        Rules rules = new Rules();
        rules.register(highAmountRule);
        rules.register(withdrawalRule);
        rules.register(sameAccountRule);
        rules.register(internationalRule);
        rules.register(lateNightRule);

        // Run the engine
        RulesEngine engine = new DefaultRulesEngine();
        engine.fire(rules, facts);

        // Set status based on final score
        int score = transaction.getRiskScore();
        if (score >= 75) {
            transaction.setStatus("ESCALATED");
        } else if (score >= 40) {
            transaction.setStatus("FLAGGED");
        } else {
            transaction.setStatus("PENDING");
        }
    }
}
