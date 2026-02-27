import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Challenges.css';
import ChallengeCard from './ChallengeCard';

const Challenges = () => {
  const challengeData = [
    { title: "Celebrate The Spirit Of Diwali Through Art", isReversed: false },
    { title: "Celebrate The Spirit Of Diwali Through Art", isReversed: true },
    { title: "Celebrate The Spirit Of Diwali Through Art", isReversed: false },
    { title: "Celebrate The Spirit Of Diwali Through Art", isReversed: true }
  ];

  return (
    <div className="container px-0">
      <div className="challenges-container">
        <h1 className="challenges-heading">Challenges</h1>
        <p className="challenges-subheading">
          Challenge Yourself, Inspire Others
        </p>
      </div>

<div className="challenge-list">
  {challengeData.map((challenge, index) => (
    <ChallengeCard key={index} {...challenge} />
  ))}
</div>
    </div>
  );
};

export default Challenges;
