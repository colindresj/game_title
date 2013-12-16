require "spec_helper"

describe "The Game"do

  before(:each) { visit "/" }

  it "has a button to start the game", :js => true do
    expect(page).to have_button("Start the Game")
  end

  xit "says the name of the app" do
    expect(page).to have_css("h1")
    expect(page).to have_content("Story App")
  end

  context "when clicking on the start game button", :js => true do

    before(:each) do
      visit "/"
      click_button("Start the Game")
    end

    it "shows the first chapter" do
      expect(page).to have_content("chapter 1")
      expect(page).to have_css("#chapter-1")
    end

    it "has a bunch of inputs(riddles) and no .solved" do
      expect(page).to have_css('input[type="text"]')
      expect(page).to_not have_css(".solved")
    end

    it "should start at 0 points" do
      expect(page).to have_content("Points: 0")
    end

  end

  context "when solving a riddle", :js => true do

    before(:each) do
      click_button("Start the Game")
      @answer = "nervous"
      page.first(".riddle").set(@answer)
    end

    it "replaces the input with a span in the answer" do
      expect(page).to have_css("span")
      expect(page).to have_content(@answer)
    end

    it "should increase the points count by 50" do
      expect(page).to have_content("Points: 50")
    end

  end

  context "when solving all the riddles in a chapter", :js => true do

    before(:each) do
      visit "/"
      click_button("Start the Game")
      page.first(".riddle").set("nervous")
      page.first(".riddle").set("senses")
      page.first(".riddle").set("earth")
      page.first(".riddle").set("story")
    end

    it "shows the next chapter" do
      expect(page).to have_content("chapter 2")
      expect(page).to have_css("#chapter-2")
    end

  end

end
