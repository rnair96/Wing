// Define a RankBadge class
export class RankBadge {
    // Define your ranks and badges as a static object
    static ranks = {
      "Airman": require("../images/airmanfc.png"),
      "Staff Sergeant": require("../images/staffsergeant.png"),
      "Lieutenant": require("../images/lieutenant.jpg"),
      "Captain": require("../images/captain.png"),
      "Lieutenant Colonel": require("../images/lieutenantcolonel.png"),
      "Colonel": require("../images/colonel.png"),
      "General": require("../images/general_Badge.png"),
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
      return RankBadge.ranks[rank];
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
  }
  