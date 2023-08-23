// Define a RankBadge class
export class RankBadge {
    // Define your ranks and badges as a static object
    static ranks = {
      "Airman": {
        badge: require("../images/airmanfc.png"),
        points: {lower: 0, upper: 15},
      },
      "Staff Sergeant": {//could have a better image but not the worst
        badge: require("../images/staffsergeant.png"),
        points: {lower: 16, upper: 40},
      },
      "Lieutenant": {//image is kinda trash
        badge: require("../images/lieutenant.jpg"),
        points: {lower: 41, upper: 75},
      },
      "Captain": {//image doesnt correctly come out 
        badge: require("../images/captain.png"),
        points: {lower: 76, upper: 110},
      },
      "Lieutenant Colonel": {//top of image doesn't correctly come out
        badge: require("../images/lieutenantcolonel.png"),
        points: {lower: 111, upper: 165},
      },
      "Colonel": {
        badge: require("../images/colonel.png"),
        points: {lower: 166, upper: 235},
      },
      "General": {//top of image doesn't correctly come out
        badge: require("../images/general_Badge.png"),
        points: {lower: 236, upper: Infinity},
      },
    };
  
    // Define a list of ranks for reference
    static rankList = [
      "Airman",
      "Staff Sergeant",
      "Lieutenant",
      "Captain",
      "Lieutenant Colonel",
      "Colonel",
      "General",
    ];
  
    // Get the badge of a rank
    static getBadge(rank) {
      return RankBadge.ranks[rank].badge;
    }
  
    // Promote to the next rank
    static promote(currentRank) {
      const currentIndex = RankBadge.rankList.indexOf(currentRank);
      if (currentIndex < RankBadge.rankList.length - 1) {
        // If the current rank is not the highest, return the next rank
        return RankBadge.rankList[currentIndex + 1];
      }
      return null; // Return null if the current rank is the highest
    }
  
    // Determine rank from points
    static determineRank(points) {
      for (const rank of RankBadge.rankList) {
        const range = RankBadge.ranks[rank].points;
        if (points >= range.lower && points <= range.upper) {
          return rank;
        }
      }
      return null; // Return null if points are not within the range of any rank
    }


    static pointsToNextRank(currentPoints, currentRank) {
      const currentRankIndex = RankBadge.rankList.indexOf(currentRank);
      
      // Check if user is at the highest rank already
      if (currentRankIndex === RankBadge.rankList.length - 1) {
          return "You're at the highest rank!";
      }
    
      const nextRank = RankBadge.rankList[currentRankIndex + 1];
      const pointsForNextRank = RankBadge.ranks[nextRank].points.lower;
    
      const pointsNeeded = pointsForNextRank - currentPoints;
    
      return pointsNeeded; // You can modify this to return a string or other desired format if you like
    }
  }
  