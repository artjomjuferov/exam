arr = Dir.entries(".")
arr.each do |name|
   p "<script type='text/javascript' src='lib/math/#{name}'></script>"
end
